import split from 'lodash/split';
import { DataSource } from '../DataSource';
import * as aafunc from '../aafunc';
import dataProcessor from '../dataProcessor';

const datasourceRequestMock = jest.fn().mockResolvedValue(createDefaultResponse());

jest.mock(
  '@grafana/runtime',
  () => ({
    getBackendSrv: () => ({
      datasourceRequest: datasourceRequestMock,
    }),
    getTemplateSrv: () => ({
      replace: jest.fn().mockImplementation(query => query),
    }),
  }),
  { virtual: true }
);

beforeEach(() => {
  datasourceRequestMock.mockClear();
});

function createDefaultResponse() {
  return {
    data: [
      {
        meta: { name: 'PV', PREC: '0' },
        data: [
          { secs: 1262304000, val: 0, nanos: 123000000, severity: 0, status: 0 },
          { secs: 1262304001, val: 1, nanos: 456000000, severity: 0, status: 0 },
          { secs: 1262304002, val: 2, nanos: 789000000, severity: 0, status: 0 },
        ],
      },
    ],
  };
}

describe('Archiverappliance Functions', () => {
  const ctx: any = {};

  beforeEach(() => {
    ctx.instanceSettings = {
      url: 'url_header:',
    };
    ctx.ds = new DataSource(ctx.instanceSettings);
  });

  it('should return the server results with scale function', done => {
    datasourceRequestMock.mockImplementation(request =>
      Promise.resolve({
        data: [
          {
            meta: { name: 'PV', PREC: '0' },
            data: [
              { secs: 1262304001, val: 1, nanos: 456000000, severity: 0, status: 0 },
              { secs: 1262304002, val: 2, nanos: 789000000, severity: 0, status: 0 },
            ],
          },
        ],
      })
    );

    const query = {
      targets: [
        {
          target: 'PV',
          refId: 'A',
          functions: [aafunc.createFuncInstance(aafunc.getFuncDef('scale'), [100])],
        },
      ],
      range: { from: new Date('2010-01-01T00:00:00.000Z'), to: new Date('2010-01-01T00:00:30.000Z') },
      maxDataPoints: 1000,
    };

    ctx.ds.query(query).then((result: any) => {
      expect(result.data).toHaveLength(1);
      const series = result.data[0];
      expect(series.target).toBe('PV');
      expect(series.datapoints).toHaveLength(2);
      expect(series.datapoints[0][0]).toBe(100);
      expect(series.datapoints[1][0]).toBe(200);
      expect(series.datapoints[0][1]).toBe(1262304001456);
      expect(series.datapoints[1][1]).toBe(1262304002789);
      done();
    });
  });

  it('should return the server results with offset function', done => {
    datasourceRequestMock.mockImplementation(request =>
      Promise.resolve({
        _request: request,
        data: [
          {
            meta: { name: 'PV', PREC: '0' },
            data: [
              { secs: 1262304001, val: 1, nanos: 456000000, severity: 0, status: 0 },
              { secs: 1262304002, val: 2, nanos: 789000000, severity: 0, status: 0 },
            ],
          },
        ],
      })
    );

    const query = {
      targets: [
        {
          target: 'PV',
          refId: 'A',
          functions: [aafunc.createFuncInstance(aafunc.getFuncDef('offset'), [100])],
        },
      ],
      range: { from: new Date('2010-01-01T00:00:00.000Z'), to: new Date('2010-01-01T00:00:30.000Z') },
      maxDataPoints: 1000,
    };

    ctx.ds.query(query).then((result: any) => {
      expect(result.data).toHaveLength(1);
      const series = result.data[0];
      expect(series.target).toBe('PV');
      expect(series.datapoints).toHaveLength(2);
      expect(series.datapoints[0][0]).toBe(101);
      expect(series.datapoints[1][0]).toBe(102);
      expect(series.datapoints[0][1]).toBe(1262304001456);
      expect(series.datapoints[1][1]).toBe(1262304002789);
      done();
    });
  });

  it('should return the server results with delta function', done => {
    datasourceRequestMock.mockImplementation(request =>
      Promise.resolve({
        _request: request,
        data: [
          {
            meta: { name: 'PV', PREC: '0' },
            data: [
              { secs: 1262304001, val: 1, nanos: 456000000, severity: 0, status: 0 },
              { secs: 1262304002, val: 2, nanos: 789000000, severity: 0, status: 0 },
            ],
          },
        ],
      })
    );

    const query = {
      targets: [
        {
          target: 'PV',
          refId: 'A',
          functions: [aafunc.createFuncInstance(aafunc.getFuncDef('delta'), [])],
        },
      ],
      range: { from: new Date('2010-01-01T00:00:00.000Z'), to: new Date('2010-01-01T00:00:30.000Z') },
      maxDataPoints: 1000,
    };

    ctx.ds.query(query).then((result: any) => {
      expect(result.data).toHaveLength(1);
      const series = result.data[0];
      expect(series.target).toBe('PV');
      expect(series.datapoints).toHaveLength(1);
      expect(series.datapoints[0][0]).toBe(1);
      expect(series.datapoints[0][1]).toBe(1262304002789);
      done();
    });
  });

  it('should return the server results with fluctuation function', done => {
    datasourceRequestMock.mockImplementation(request =>
      Promise.resolve({
        _request: request,
        data: [
          {
            meta: { name: 'PV', PREC: '0' },
            data: [
              { secs: 1262304001, val: 100, nanos: 456000000, severity: 0, status: 0 },
              { secs: 1262304002, val: 200, nanos: 789000000, severity: 0, status: 0 },
              { secs: 1262304002, val: 300, nanos: 789000000, severity: 0, status: 0 },
            ],
          },
        ],
      })
    );

    const query = {
      targets: [
        {
          target: 'PV',
          refId: 'A',
          functions: [aafunc.createFuncInstance(aafunc.getFuncDef('fluctuation'), [])],
        },
      ],
      range: { from: new Date('2010-01-01T00:00:00.000Z'), to: new Date('2010-01-01T00:00:30.000Z') },
      maxDataPoints: 1000,
    };

    ctx.ds.query(query).then((result: any) => {
      expect(result.data).toHaveLength(1);
      const series = result.data[0];
      expect(series.target).toBe('PV');
      expect(series.datapoints).toHaveLength(3);
      expect(series.datapoints[0][0]).toBe(0);
      expect(series.datapoints[1][0]).toBe(100);
      expect(series.datapoints[2][0]).toBe(200);
      done();
    });
  });

  it('should return the server results with top function', done => {
    datasourceRequestMock.mockImplementation(request => {
      const pvname = unescape(split(request.url, /pv=(.*?)&/)[1]);
      let pvdata = [];
      if (pvname === 'PV1') {
        pvdata = [
          {
            meta: { name: pvname, PREC: '0' },
            data: [
              { secs: 1262304001, val: 0, nanos: 456000000, severity: 0, status: 0 },
              { secs: 1262304002, val: 1, nanos: 789000000, severity: 0, status: 0 },
              { secs: 1262304002, val: 2, nanos: 789000000, severity: 0, status: 0 },
            ],
          },
        ];
      } else if (pvname === 'PV2') {
        pvdata = [
          {
            meta: { name: pvname, PREC: '0' },
            data: [
              { secs: 1262304001, val: 3, nanos: 456000000, severity: 0, status: 0 },
              { secs: 1262304002, val: 4, nanos: 789000000, severity: 0, status: 0 },
              { secs: 1262304002, val: 5, nanos: 789000000, severity: 0, status: 0 },
            ],
          },
        ];
      } else {
        pvdata = [
          {
            meta: { name: pvname, PREC: '0' },
            data: [
              { secs: 1262304001, val: 0, nanos: 456000000, severity: 0, status: 0 },
              { secs: 1262304002, val: 0, nanos: 789000000, severity: 0, status: 0 },
              { secs: 1262304002, val: 0, nanos: 789000000, severity: 0, status: 0 },
            ],
          },
        ];
      }

      return Promise.resolve({
        _request: request,
        data: pvdata,
      });
    });

    const query = {
      targets: [
        {
          target: '(PV1|PV2|PV3)',
          refId: 'A',
          functions: [aafunc.createFuncInstance(aafunc.getFuncDef('top'), [2, 'avg'])],
        },
      ],
      range: { from: new Date('2010-01-01T00:00:00.000Z'), to: new Date('2010-01-01T00:00:30.000Z') },
      maxDataPoints: 1000,
    };

    ctx.ds.query(query).then((result: any) => {
      expect(result.data).toHaveLength(2);
      const series1 = result.data[0];
      const series2 = result.data[1];
      expect(series1.target).toBe('PV2');
      expect(series2.target).toBe('PV1');
      expect(series1.datapoints).toHaveLength(3);
      expect(series1.datapoints[0][0]).toBe(3);
      expect(series1.datapoints[1][0]).toBe(4);
      expect(series1.datapoints[2][0]).toBe(5);
      done();
    });
  });

  it('should return aggregated value', () => {
    const timeseriesData = [
      {
        target: 'min',
        datapoints: [
          [0, 0],
          [1, 0],
          [2, 0],
          [3, 0],
          [4, 0],
        ],
      },
      {
        target: 'max',
        datapoints: [
          [1, 0],
          [1, 0],
          [1, 0],
          [1, 0],
          [7, 0],
        ],
      },
      {
        target: 'avgsum',
        datapoints: [
          [2, 0],
          [3, 0],
          [4, 0],
          [5, 0],
          [6, 0],
        ],
      },
    ];

    const topFunction = dataProcessor.aaFunctions.top;
    const bottomFunction = dataProcessor.aaFunctions.bottom;

    const minTopData = topFunction(3, 'min', timeseriesData);
    const maxTopData = topFunction(1, 'max', timeseriesData);
    const avgTopData = topFunction(1, 'avg', timeseriesData);
    const sumTopData = topFunction(1, 'sum', timeseriesData);

    const minBottomData = bottomFunction(3, 'min', timeseriesData);
    const maxBottomData = bottomFunction(1, 'max', timeseriesData);
    const avgBottomData = bottomFunction(1, 'avg', timeseriesData);
    const sumBottomData = bottomFunction(1, 'sum', timeseriesData);

    expect(minTopData).toHaveLength(3);
    expect(minTopData[0].target).toBe('avgsum');
    expect(minTopData[1].target).toBe('max');
    expect(minTopData[2].target).toBe('min');

    expect(maxTopData).toHaveLength(1);
    expect(maxTopData[0].target).toBe('max');

    expect(avgTopData).toHaveLength(1);
    expect(avgTopData[0].target).toBe('avgsum');

    expect(sumTopData).toHaveLength(1);
    expect(sumTopData[0].target).toBe('avgsum');

    expect(minBottomData).toHaveLength(3);
    expect(minBottomData[0].target).toBe('min');
    expect(minBottomData[1].target).toBe('max');
    expect(minBottomData[2].target).toBe('avgsum');

    expect(maxBottomData).toHaveLength(1);
    expect(maxBottomData[0].target).toBe('min');

    expect(avgBottomData).toHaveLength(1);
    expect(avgBottomData[0].target).toBe('min');

    expect(sumBottomData).toHaveLength(1);
    expect(sumBottomData[0].target).toBe('min');

    const timeseriesDataAbs = [
      {
        target: 'min',
        datapoints: [
          [0, 0],
          [3, 0],
        ],
      },
      {
        target: 'max',
        datapoints: [
          [-6, 0],
          [-5, 0],
          [-4, 0],
          [-3, 0],
          [-2, 0],
        ],
      },
      {
        target: 'avgsum',
        datapoints: [
          [3, 0],
          [4, 0],
        ],
      },
    ];

    const absMinTopData = topFunction(1, 'absoluteMin', timeseriesDataAbs);
    const absMaxTopData = topFunction(1, 'absoluteMax', timeseriesDataAbs);
    const absMinBottomData = bottomFunction(1, 'absoluteMin', timeseriesDataAbs);
    const absMaxBottomData = bottomFunction(1, 'absoluteMax', timeseriesDataAbs);

    expect(absMinTopData).toHaveLength(1);
    expect(absMinTopData[0].target).toBe('avgsum');

    expect(absMaxTopData).toHaveLength(1);
    expect(absMaxTopData[0].target).toBe('max');

    expect(absMinBottomData).toHaveLength(1);
    expect(absMinBottomData[0].target).toBe('min');

    expect(absMaxBottomData).toHaveLength(1);
    expect(absMaxBottomData[0].target).toBe('min');
  });

  it('should return the server results with exclude function', done => {
    datasourceRequestMock.mockImplementation(request => {
      const pvname = unescape(split(request.url, /pv=(.*?)&/)[1]);
      const pvdata = [
        {
          meta: { name: pvname, PREC: '0' },
          data: [{ secs: 1262304001, val: 0, nanos: 456000000, severity: 0, status: 0 }],
        },
      ];

      return Promise.resolve({
        _request: request,
        data: pvdata,
      });
    });

    const query = {
      targets: [
        {
          target: '(PV1|PV2|PVA|PVB)',
          refId: 'A',
          functions: [aafunc.createFuncInstance(aafunc.getFuncDef('exclude'), ['PV[0-9]'])],
        },
      ],
      range: { from: new Date('2010-01-01T00:00:00.000Z'), to: new Date('2010-01-01T00:00:30.000Z') },
      maxDataPoints: 1000,
    };

    ctx.ds.query(query).then((result: any) => {
      expect(result.data).toHaveLength(2);
      const series1 = result.data[0];
      const series2 = result.data[1];
      expect(series1.target).toBe('PVA');
      expect(series2.target).toBe('PVB');
      done();
    });
  });

  it('should return option variables if option functions are applied', done => {
    const options = {
      targets: [
        {
          target: 'PV',
          refId: 'A',
          functions: [aafunc.createFuncInstance(aafunc.getFuncDef('maxNumPVs'), [1000])],
        },
      ],
      range: { from: new Date('2010-01-01T00:00:00.000Z'), to: new Date('2010-01-01T00:00:30.000Z') },
      maxDataPoints: 1000,
    };

    const query = ctx.ds.buildQueryParameters(options);

    expect(query.targets).toHaveLength(1);
    expect(query.targets[0].options.maxNumPVs).toBe(1000);
    done();
  });
});