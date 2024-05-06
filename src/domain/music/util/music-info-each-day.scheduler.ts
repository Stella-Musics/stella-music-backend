import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Music } from "../entity/music.entity";
import { YoutubeUtils } from "src/global/thridparty/youtube/youtube.util";
import { ViewsOfDay } from "../entity/views-of-day.entity";
import { MusicSchedulerUtil } from "./music-scheduler.util";

@Injectable()
export class MusicInfoEachDayScheduler {
  constructor(
    @InjectRepository(Music)
    private readonly musicRepository: Repository<Music>,
    @InjectRepository(ViewsOfDay)
    private readonly viewsOfDayRepository: Repository<ViewsOfDay>,
    private readonly musicSchdulerUtil: MusicSchedulerUtil,
    private readonly youtubeUtils: YoutubeUtils
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async getMusicInfoEachDay() {
    const musicList = await this.musicRepository.find();

    const musicIdList = musicList.map((music) => {
      return music.id;
    });

    const musicInfoList = await this.youtubeUtils.getVideoInfos(musicIdList);

    const viewsOfDayList = await Promise.all(
      musicInfoList.map(async (musicInfo) => {
        const musicId = musicInfo.videoId;
        const music = musicList.find((music) => music.id === musicId);

        if (music == undefined) throw new Error("this music is not found");

        const viewsOfDay = new ViewsOfDay(musicInfo.viewCount, music!, new Date());
        return await this.viewsOfDayRepository.save(viewsOfDay);
      })
    );
    viewsOfDayList.sort((a: ViewsOfDay, b: ViewsOfDay) => b.views - a.views);

    viewsOfDayList.forEach(async (viewsOfDay, index) => {
      await this.musicSchdulerUtil.saveChartEntityByViewsEntity(viewsOfDay, index);
    });
  }
}
