// export a function to get a percentage and a value and calculate the percentage of that value
export const calculatePercentageMargin = (value: number, percentage: number) => {
       return value - (value * (percentage / 100));
}