import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Music } from "../entity/music.entity";
import { YoutubeUtils } from "src/global/thridparty/youtube/youtube.util";
import { ViewsOfHour } from "../entity/views-of-hour.entity";
import { MusicSchedulerUtil } from "./music-scheduler.util";

@Injectable()
export class MusicInfoEachHourScheduler {
  constructor(
    @InjectRepository(Music)
    private readonly musicRepository: Repository<Music>,
    @InjectRepository(ViewsOfHour)
    private readonly viewsOfHourRepository: Repository<ViewsOfHour>,
    private readonly musicSchedulerUtil: MusicSchedulerUtil,
    private readonly youtubeUtils: YoutubeUtils
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async getMusicInfoEachHour() {
    const musicList = await this.musicRepository.find();

    const musicIdList = musicList.map((music) => {
      return music.id;
    });

    const musicInfoList = await this.youtubeUtils.getVideoInfos(musicIdList);

    const viewsOfHourList = await Promise.all(
      musicInfoList.map(async (musicInfo) => {
        const musicId = musicInfo.videoId;
        const music = musicList.find((music) => music.id === musicId);

        if (music == undefined) throw new Error("this music is not found");

        music.views = musicInfo.viewCount;
        this.musicRepository.update(musicId, { views: musicInfo.viewCount });

        const viewsOfHour = new ViewsOfHour(musicInfo.viewCount, music!, new Date());
        return await this.viewsOfHourRepository.save(viewsOfHour);
      })
    );
    viewsOfHourList.sort((a: ViewsOfHour, b: ViewsOfHour) => b.views - a.views);

    await Promise.all(
      viewsOfHourList.map(async (viewsOfHour, index) => {
        await this.musicSchedulerUtil.saveChartEntityByViewsEntity(viewsOfHour, index);
      })
    );
  }
}
