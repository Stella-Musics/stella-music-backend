import { Cron } from "@nestjs/schedule";
import { ViewsOfYear } from "../entity/views-of-year.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { YoutubeUtils } from "src/global/thridparty/youtube/youtube.util";
import { Music } from "../entity/music.entity";
import { MusicSchedulerUtil } from "./music-scheduler.util";

export class MusicInfoEachYearScheduler {
  constructor(
    private readonly youtubeUtils: YoutubeUtils,
    @InjectRepository(Music)
    private readonly musicRepository: Repository<Music>,
    @InjectRepository(ViewsOfYear)
    private readonly viewsOfYearRepository: Repository<ViewsOfYear>,
    private readonly musicSchedulerUtil: MusicSchedulerUtil
  ) {}

  @Cron("0 0 1 1 *")
  async getMusicInfoEachYear() {
    const musicList = await this.musicRepository.find();

    const musicIdList = musicList.map((music) => {
      return music.id;
    });

    const musicInfoList = await this.youtubeUtils.getVideoInfos(musicIdList);

    const viewsOfYearList = await Promise.all(
      musicInfoList.map(async (musicInfo) => {
        const musicId = musicInfo.videoId;
        const music = musicList.find((music) => music.id === musicId);

        if (music == undefined) throw new Error("this music is not found");

        const viewsOfYear = new ViewsOfYear(musicInfo.viewCount, music, new Date());
        return await this.viewsOfYearRepository.save(viewsOfYear);
      })
    );
    viewsOfYearList.sort((a: ViewsOfYear, b: ViewsOfYear) => b.views - a.views);

    viewsOfYearList.forEach(async (viewsOfYear, index) => {
      await this.musicSchedulerUtil.saveChartEntityByViewsEntity(viewsOfYear, index);
    });
  }
}
