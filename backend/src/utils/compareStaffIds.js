export const compareStaffIds = ({
  oldStaffIds = [],
  newStaffIds = [],
  oldAcceptedStaffIds = [],
}) => {
  const oldIds = oldStaffIds.map(String);
  const newIds = newStaffIds.map(String);
  const acceptedIds = oldAcceptedStaffIds.map(String);

  return {
    oldStaffIds: oldIds,

    newStaffIds: newIds,

    addedStaffIds: newIds.filter(
      (id) => !oldIds.includes(id),
    ),

    removedStaffIds: oldIds.filter(
      (id) => !newIds.includes(id),
    ),

    unchangedStaffIds: oldIds.filter(
      (id) => newIds.includes(id),
    ),

    acceptedStaffIds: acceptedIds.filter(
      (id) => newIds.includes(id),
    ),
  };
};