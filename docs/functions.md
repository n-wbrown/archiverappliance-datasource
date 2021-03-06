# Functions
## Categories
Functions are categorized into below groups.

- **Transform:** converts the timeseries datapoints from its datapoint values.
- **Array to Scalar:** converts the array data to scalar timeseries data with some method.
- **Filter Series:** picks up some series that meet certain condition.
- **Sort:** sorts the list of timeseries.
- **Options:** adds option parameters.

## Transform Functions

### _scale_
``` function:: scale(factor)
```

Multiplies datapoint by _factor_ at each point.

Examples:

```js
scale(10)
scale(-0.5)
```

### _offset_
``` function:: offset(delta)
```

Adds _delta_ to each datapoint.

Examples:

```js
offset(50)
offset(-0.5)
```

### _delta_
``` function:: delta()
```

Calculates difference between datapoint and its before point at each point.

### _fluctuation_
``` function:: fluctuation()
```

Subtracts first datapoint value from each datapoint.

### _movingAverage_
``` function:: movingAverage(windowSize)
```

Calculates the moving average of datapoints over a fixed number of past points, specified by windowSize param.

Examples:

```js
movingAverage(10)
movingAverage(50)
```

## Array to Scalar Functions

### _toScalarByAvg_
``` function:: toScalarByAvg()
```

Converts the array data to the scalar data with the average value.

### _toScalarByMax_
``` function:: toScalarByMax()
```

Converts the array data to the scalar data with the maximum value.

### _toScalarByMin_
``` function:: toScalarByMin()
```

Converts the array data to the scalar data with the minimum value.

### _toScalarBySum_
``` function:: toScalarBySum()
```

Converts the array data to the scalar data with the total value.

### _toScalarByMed_
``` function:: toScalarByMed()
```

Converts the array data to the scalar data with the median value.

### _toScalarByStd_
``` function:: toScalarByStd()
```

Converts the array data to the scalar data with the standard deviation value.

## Filter Series Functions

### _top_
``` function:: top(number, value)
```

Returns top N series sorted by _value_.
Available _value_ is as following: _avg_, _min_, _max_, _absoluteMin_, _absoluteMax_, and _sum_.

Examples:

```js
top(5, max)
top(10, avg)
```

### _bottom_
``` function:: bottom(number, value)
```

Returns bottom N series sorted by _value_.
Available _value_ is as following: _avg_, _min_, _max_, _absoluteMin_, _absoluteMax_, and _sum_.

Examples:

```js
bottom(5, avg)
bottom(10, min)
```

### _exclude_
``` function:: exclude(pattern)
```

Exclude PV data that match the regular expression.

Examples:

```js
exclude(PV[0-9])
```

## Sort Functions
### _sortByAvg_
``` function:: sortByAvg(order)
```

Sort the list of timeseries by the average value across the time period specified.

Examples:

```js
sortByAvg(desc)
sortByAvg(asc)
```

### _sortByMax_
``` function:: sortByMax(order)
```

Sort the list of timeseries by the maximum value across the time period specified.

Examples:

```js
sortByMax(desc)
sortByMax(asc)
```

### _sortByMin_
``` function:: sortByMin(order)
```

Sort the list of timeseries by the minimum value across the time period specified.

Examples:

```js
sortByMin(desc)
sortByMin(asc)
```

### _sortBySum_
``` function:: sortBySum(order)
```

Sort the list of timeseries by the total value across the time period specified.

Examples:

```js
sortBySum(desc)
sortBySum(asc)
```

### _sortByAbsMax_
``` function:: sortByAbsMax(order)
```

Sort the list of timeseries by the absolute maximum value across the time period specified.

Examples:

```js
sortByAbsMax(desc)
sortByAbsMax(asc)
```

### _sortByAbsMin_
``` function:: sortByAbsMin(order)
```

Sort the list of timeseries by the absolute minimum value across the time period specified.

Examples:

```js
sortByAbsMin(desc)
sortByAbsMin(asc)
```

## Options Functions
### _maxNumPVs_
``` function:: maxNumPVs(number)
```

Set maximum number of PVs you can select for a target.

Examples:

```js
maxNumPVs(500)
```

### _binInterval_
``` function:: binInterval(interval)
```

Set binning interval for processing of data.
For example, if binInterval is set 100 and operator in query is set mean then returned values are average values in 100 seconds wide bins.

Examples:

```js
binInterval(100)
```

### _disableAutoRaw_
``` function:: disableAutoRaw(boolean)
```

Disable [auto raw feature](tips.html#auto-raw-operation).

Examples:

```js
disableAutoRaw(true)
disableAutoRaw(false)
```

### _disableExtrapol_
``` function:: disableExtrapol(boolean)
```

Disable [extrapolation for raw data](tips.html#extrapolation-for-raw-operation).

Examples:

```js
disableExtrapol(true)
disableExtrapol(false)
```