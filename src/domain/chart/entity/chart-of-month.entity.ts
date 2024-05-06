import { Entity } from "typeorm";
import { BaseChartEntity } from "./base/base-chart.entity";

@Entity()
export class ChartOfMonth extends BaseChartEntity {}
