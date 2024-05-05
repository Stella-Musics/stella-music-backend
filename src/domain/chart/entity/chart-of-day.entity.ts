import { Entity } from "typeorm";
import { BaseChartEntity } from "./base/base-chart.entity";

@Entity()
export class ChartOfDay extends BaseChartEntity {}
