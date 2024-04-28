import { Cron } from "@nestjs/schedule";
import { ViewsOfYear } from "../entity/views-of-year.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { ChartOfYear } from "src/domain/chart/entity/chart-of-year.entity";
import { Repository } from "typeorm";
import { YoutubeUtils } from "src/global/thridparty/youtube/youtube.util";
import { Music } from "../entity/music.entity";

export class MusicInfoEachYearScheduler {
  constructor(
    private readonly youtubeUtils: YoutubeUtils,
    @InjectRepository(Music)
    private readonly musicRepository: Repository<Music>,
    @InjectRepository(ViewsOfYear)
    private readonly viewsOfYearRepository: Repository<ViewsOfYear>,
    @InjectRepository(ChartOfYear)
    private readonly chartOfYearRepository: Repository<ChartOfYear>
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
        return await this.viewsOfYearRepository.save({
          views: musicInfo.viewCount,
          music: music,
          createdAt: Date()
        });
      })
    );
    viewsOfYearList.sort((a: ViewsOfYear, b: ViewsOfYear) => b.views - a.views);

    viewsOfYearList.forEach(async (viewsOfYear, index) => {
      const chartOfYear =
        (await this.chartOfYearRepository.findOneBy({ music: viewsOfYear.music })) ??
        (await this.chartOfYearRepository.save({
          music: viewsOfYear.music,
          views: viewsOfYear.views,
          ranking: index + 1,
          rise: 0,
          createdAt: Date()
        }));

      this.chartOfYearRepository.update(
        {
          id: chartOfYear.id
        },
        {
          views: chartOfYear.views,
          ranking: index + 1,
          rise: chartOfYear.ranking - (index + 1)
        }
      );
    });
  }
}
