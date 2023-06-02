import {
  ArchiveIcon,
  CallRecordStyle,
  CallDateStyle,
  CallDetailStyle,
  CallFromStyle,
  PhoneIncomingStyle,
  PhoneMissedStyle,
  VoicemailStyle,
  CallViaStyle,
  CallTimeStyle,
  ThreeDotVertStyle,
  ArchiveSwipeStyle,
  UndoStyle,
} from "../styled/ActivitiesStyles";
import {
  SwipeableList,
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
} from "react-swipeable-list";
import "react-swipeable-list/dist/styles.css";

// Implementing the swipe feature for archiving a call and undoing an archived call
const trailingActions = (handleCallArchive, isArchived) => (
  <TrailingActions>
    <SwipeAction onClick={() => handleCallArchive()} destructive={true}>
      <ArchiveSwipeStyle isArchived={isArchived}>
        {isArchived ? (
          <UndoStyle size="24" />
        ) : (
          <ArchiveIcon style={{ minWidth: "24px" }} />
        )}
      </ArchiveSwipeStyle>
    </SwipeAction>
  </TrailingActions>
);

const CallIcon = ({ callType }) => {
  if (callType === "answered") {
    return <PhoneIncomingStyle size="18" />;
  } else if (callType === "missed") {
    return <PhoneMissedStyle size="18" />;
  } else if (callType === "voicemail") {
    return <VoicemailStyle size="18" />;
  } else {
    return null;
  }
};

const CallFrom = ({ direction, from, to }) => {
  if (direction === "inbound") {
    return <>{from ?? "XXXX"}</>;
  } else if (direction === "outbound") {
    return <>{to ?? "XXXX"}</>;
  } else {
    return null;
  }
};

const CallRecord = ({
  id,
  date,
  from,
  to,
  callType,
  isArchived,
  via,
  direction,
  activitiesRef,
  setActivities,
  makeActivities,
  callIndex,
}) => {
  let newDate = new Date(date);
  let dateOptions = { year: "numeric", month: "long", day: "numeric" };
  let timeOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  let formatDate = new Intl.DateTimeFormat("en-US", dateOptions);
  let formatTime = new Intl.DateTimeFormat("en-US", timeOptions);
  let shortDate = formatDate.format(newDate);
  let fullTime = formatTime.format(newDate);
  let time = fullTime.match(/[\d:]+/);
  let ampm = fullTime.match(/PM|AM/);

  /* Fetches the selected call ID's activity json and updates is_archived in activitiesRef to the opposite value
    of isArchived which was fetched previously */
  const handleCallArchive = () => {
    const _data = {
      is_archived: !isArchived,
    };

    const requestOptions = {
      method: "PATCH",
      body: JSON.stringify(_data),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    };

    fetch(`${process.env.REACT_APP_HOST_URL}/${id}`, requestOptions)
      .then((response) => response.json())
      .then((json) => {
        activitiesRef[callIndex].is_archived = json.is_archived; // Update is_archived with the updated version from fetch POST
        setActivities(makeActivities(activitiesRef)); // Update the state of activities here with an updated copy
      })
      .catch((err) => console.log(err));
  };

  return (
    <CallRecordStyle>
      <CallDateStyle>{shortDate}</CallDateStyle>
      <SwipeableList destructiveCallbackDelay={100}>
        <SwipeableListItem
          trailingActions={trailingActions(handleCallArchive, isArchived)}
        >
          <CallDetailStyle>
            <CallIcon callType={callType} />
            <CallFromStyle>
              <CallFrom direction={direction} to={to} from={from} />
              <CallViaStyle>tried to call on {via}</CallViaStyle>
            </CallFromStyle>
            <ThreeDotVertStyle size="16" />
            <CallTimeStyle>
              <div id="time">{time}</div>
              <div id="ampm">{ampm}</div>
            </CallTimeStyle>
          </CallDetailStyle>
        </SwipeableListItem>
      </SwipeableList>
    </CallRecordStyle>
  );
};

const ArchiveOrUndo = ({
  archiveOrUndo,
  activities,
  setActivities,
  makeActivities,
  activitiesRef,
}) => {
  // A function that parses through all activities and archives them all
  const handleArchiveAll = () => {
    activities.forEach((activity, index) => {
      const _data = {
        is_archived: true,
      };

      const requestOptions = {
        method: "PATCH",
        body: JSON.stringify(_data),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      };

      fetch(`${process.env.REACT_APP_HOST_URL}/${activity.id}`, requestOptions)
        .then((response) => response.json())
        .then((json) => {
          activitiesRef[index].is_archived = json.is_archived; // Update is_archived with the updated version from POST
          setActivities(makeActivities(activitiesRef)); // Update the state of activities here with an updated copy
        })
        .catch((err) => console.log(err));
    });
  };

  // A function that parses through all activities and unarchives them all
  const handleUndoAll = () => {
    activities.forEach((activity, index) => {
      const _data = {
        is_archived: false,
      };

      const requestOptions = {
        method: "PATCH",
        body: JSON.stringify(_data),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      };

      fetch(`${process.env.REACT_APP_HOST_URL}/${activity.id}`, requestOptions)
        .then((response) => response.json())
        .then((json) => {
          activitiesRef[index].is_archived = json.is_archived; // Update is_archived with the updated version from POST
          setActivities(makeActivities(activitiesRef)); // Update the state of activities here with an updated copy
        })
        .catch((err) => console.log(err));
    });
  };

  return (
    <CallRecordStyle>
      {archiveOrUndo === "archive" ? (
        <CallDetailStyle
          onClick={handleArchiveAll}
          style={{ marginTop: "0", marginBottom: "10px", padding: "15px 0" }}
        >
          <ArchiveIcon />
          <span style={{ fontWeight: "600" }}>Archive all calls</span>
        </CallDetailStyle>
      ) : archiveOrUndo === "undo" ? (
        <CallDetailStyle
          onClick={handleUndoAll}
          style={{ marginTop: "0", marginBottom: "10px", padding: "15px 0" }}
        >
          <UndoStyle size="20" />
          <span style={{ fontWeight: "600" }}>Unarchive all calls</span>
        </CallDetailStyle>
      ) : null}
    </CallRecordStyle>
  );
};

const ActivityFeed = ({
  activities,
  activitiesRef,
  makeActivities,
  setActivities,
}) => {
  if (activities) {
    return (
      <>
        <ArchiveOrUndo
          archiveOrUndo={"archive"}
          activities={activities}
          setActivities={setActivities}
          makeActivities={makeActivities}
          activitiesRef={activitiesRef}
        />
        {activities.map((activity, index) =>
          !activity.is_archived && activity.call_type && activity.direction ? (
            <CallRecord
              key={activity.id}
              date={activity.created_at}
              from={activity.from}
              to={activity.to}
              callType={activity.call_type}
              isArchived={activity.is_archived}
              via={activity.via}
              direction={activity.direction}
              id={activity.id}
              activitiesRef={activitiesRef}
              makeActivities={makeActivities}
              setActivities={setActivities}
              callIndex={index}
            />
          ) : null
        )}
      </>
    );
  } else {
    return null;
  }
};

export { CallRecord, ArchiveOrUndo };
export default ActivityFeed;
