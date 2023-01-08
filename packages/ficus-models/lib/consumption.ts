export enum EAggregateFunctions {
  MEAN = 'mean',
  MEDIAN = 'median',
  LAST = 'last',
}

export enum EWindows {
  HOURLY = 'h',
  DAYLY = 'd',
  WEEKLY = 'w',
}

export interface IResourcesConsumptions {
  [resourceId: string]: {
    [consumptionMetric: string]: {
      [aggregatorFunction: string]: (number | undefined)[],
    },
  },
}
export interface IResourcesConsumption {
  [resourceId: string]: {
    [consumptionMetric: string]: {
      [aggregatorFunction: string]: number,
    },
  },
}

export interface IConsumptionsResponse {
  timestamps: string[],
  values: IResourcesConsumptions,
}
