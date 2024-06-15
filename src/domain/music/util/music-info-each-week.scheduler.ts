import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { ViewsOfWeek } from "../entity/views-of-week.entity";
import { Repository } from "typeorm";
import { YoutubeUtils } from "src/global/thridparty/youtube/youtube.util";
import { Music } from "../entity/music.entity";
import { MusicSchedulerUtil } from "./music-scheduler.util";

export class MusicInfoEachWeekScheduler {
  constructor(
    private readonly youtubeUtils: YoutubeUtils,
    @InjectRepository(Music)
    private readonly musicRepository: Repository<Music>,
    @InjectRepository(ViewsOfWeek)
    private readonly viewsOfWeekRepository: Repository<ViewsOfWeek>,
    private readonly musicSchedulerUtil: MusicSchedulerUtil
  ) {}

  @Cron(CronExpression.EVERY_WEEK)
  async getMusicInfoEachWeek() {
    const musicList = await this.musicRepository.find();

    const musicIdList = musicList.map((music) => {
      return music.id;
    });

    const musicInfoList = await this.youtubeUtils.getVideoInfos(musicIdList);

    const viewsOfWeekList = await Promise.all(
      musicInfoList.map(async (musicInfo) => {
        const musicId = musicInfo.videoId;
        const music = musicList.find((music) => music.id === musicId);

        if (music == undefined) throw new Error("this music is not found");

        const viewsOfWeek = new ViewsOfWeek(musicInfo.viewCount, music, new Date());
        return await this.viewsOfWeekRepository.save(viewsOfWeek);
      })
    );
    viewsOfWeekList.sort((a: ViewsOfWeek, b: ViewsOfWeek) => b.views - a.views);

    await Promise.all(
      viewsOfWeekList.map(async (viewsOfWeek, index) => {
        await this.musicSchedulerUtil.saveChartEntityByViewsEntity(viewsOfWeek, index);
      })
    );
  }
}
