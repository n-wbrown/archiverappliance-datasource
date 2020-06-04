import { DataQuery, DataSourceJsonData } from '@grafana/data';

export interface AAQuery extends DataQuery {
  target: string;
  alias: string;
  operator: string;
  regex: boolean;
  aliasPattern: string;
  functions: FunctionDescriptor[];
}

export const defaultQuery: Partial<AAQuery> = {
  target: '',
  alias: '',
  operator: '',
  regex: false,
  aliasPattern: '',
  functions: [],
};

export interface TargetQuery {
  target: string;
  refId: string;
  hide: boolean | undefined;
  alias: string;
  operator: string;
  functions: FunctionDescriptor[];
  regex: boolean;
  aliasPattern: string;
  options: { [key: string]: string };
  from: Date;
  to: Date;
  interval: string;
}

export interface AADataQueryResponse {
  data: {
    data: {
      meta: { name: string; PREC: string };
      data: [{ secs: number; val: number; nanos: number; severity: number; status: number }];
    };
  };
  status: number;
  statusText: string;
  ok: boolean;
  redirected: boolean;
  type: string;
  url: string;
}

export interface FuncDef {
  defaultParams?: any;
  shortName?: any;
  version?: string;
  category: string;
  description?: string;
  fake?: boolean;
  name: string;
  params: FuncDefParam[];
}

export interface FunctionDescriptor {
  text: string;
  params: string[];
  def: FuncDef;
}

export interface FuncDefParam {
  name: string;
  options?: string[];
  type: string;
}

export const operatorList: string[] = [
  'firstSample',
  'lastSample',
  'firstFill',
  'lastFill',
  'mean',
  'min',
  'max',
  'count',
  'ncount',
  'nth',
  'median',
  'std',
  'jitter',
  'ignoreflyers',
  'flyers',
  'variance',
  'popvariance',
  'kurtosis',
  'skewness',
  'raw',
];

/**
 * These are options configured for each DataSource instance
 */
export interface AADataSourceOptions extends DataSourceJsonData {
  path?: string;
}

/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
export interface AASecureJsonData {
  apiKey?: string;
}
