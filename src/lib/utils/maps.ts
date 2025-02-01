function addToMap(map: Map<string, string[]>, key: string, value: string): void {
  if (map.has(key)) {

    // Key exists, retrieve the array, add the value, and update the map
    const array = map.get(key)!;
    array.push(value);
    map.set(key, array);
  } else {
    // Key doesn't exist, create a new array with the value
    map.set(key, [value]);
  }
}
