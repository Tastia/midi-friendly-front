export const GetRestaurants = () =>
  FilterController.getRestaurants().then((data) =>
    data
      .map((restaurant) => ({
        value: restaurant._id,
        label: restaurant.name,
      }))
      .sort((a, b) => a.label.localeCompare(b.label))
  );
