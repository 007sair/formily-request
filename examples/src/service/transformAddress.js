export const transformAddress = (data = {}) => {
  return Object.entries(data).reduce((buf, [key, value]) => {
    if (typeof value === "string")
      return buf.concat({
        label: value,
        value: key,
      });
    const { name, code, cities, districts } = value;
    const _cities = transformAddress(cities);
    const _districts = transformAddress(districts);
    return buf.concat({
      label: name,
      value: code,
      children: _cities.length
        ? _cities
        : _districts.length
        ? _districts
        : undefined,
    });
  }, []);
};
