export type ChartsDatapoint = ChartsDatapointDynamicValues & ChartsDatapointStaticValues;

interface ChartsDatapointStaticValues {
  name: string;
}

interface ChartsDatapointDynamicValues {
  [lineKey: string]: number | string;
}
