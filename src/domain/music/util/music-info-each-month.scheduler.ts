import { InjectRepository } from "@nestjs/typeorm";
import { ViewsOfMonth } from "../entity/views-of-month.entity";
import { Repository } from "typeorm";
import { Cron, CronExpression } from "@nestjs/schedule";
import { YoutubeUtils } from "src/global/thridparty/youtube/youtube.util";
import { Music } from "../entity/music.entity";
import { MusicSchedulerUtil } from "./music-scheduler.util";

export class MusicInfoEachMonthScheduler {
  constructor(
    private readonly youtubeUtils: YoutubeUtils,
    @InjectRepository(Music)
    private readonly musicRepository: Repository<Music>,
    @InjectRepository(ViewsOfMonth)
    private readonly viewsOfMonthRepository: Repository<ViewsOfMonth>,
    private readonly musicSchedulerUtil: MusicSchedulerUtil
  ) {}

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async getMusicInfoEachMonth() {
    const musicList = await this.musicRepository.find();

    const musicIdList = musicList.map((music) => {
      return music.id;
    });

    const musicInfoList = await this.youtubeUtils.getVideoInfos(musicIdList);

    const viewsOfMonthList = await Promise.all(
      musicInfoList.map(async (musicInfo) => {
        const musicId = musicInfo.videoId;
        const music = musicList.find((music) => music.id === musicId);

        if (music == undefined) throw new Error("this music is not found");

        const viewsOfMonth = new ViewsOfMonth(musicInfo.viewCount, music, new Date());
        return await this.viewsOfMonthRepository.save(viewsOfMonth);
      })
    );
    viewsOfMonthList.sort((a: ViewsOfMonth, b: ViewsOfMonth) => b.views - a.views);

    await Promise.all(
      viewsOfMonthList.map(async (viewsOfMonth, index) => {
        await this.musicSchedulerUtil.saveChartEntityByViewsEntity(viewsOfMonth, index);
      })
    );
  }
}
