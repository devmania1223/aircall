import {
  ArchiveSwitchStyle,
  ActivitySwitchBtn,
  ArchiveSwitchBtn,
} from "../styled/ArchiveStyles";
import { CallRecord, ArchiveOrUndo } from "./Activities";
import { ThreeDotVertStyle } from "../styled/ArchiveStyles";

const ArchiveSwitch = ({ setStateArchive, stateArchive }) => {
  return (
    <>
      <ArchiveSwitchStyle stateArchive={stateArchive}>
        <div id="btn"></div>
        <ActivitySwitchBtn
          stateArchive={stateArchive}
          onClick={() => setStateArchive(false)}
        >
          Activity
        </ActivitySwitchBtn>
        <ThreeDotVertStyle />
        <ArchiveSwitchBtn
          stateArchive={stateArchive}
          onClick={() => setStateArchive(true)}
        >
          Archives
        </ArchiveSwitchBtn>
      </ArchiveSwitchStyle>
    </>
  );
};

const ArchiveView = ({
  activities,
  activitiesRef,
  makeActivities,
  setActivities,
}) => {
  if (activities) {
    return (
      <>
        <ArchiveOrUndo
          archiveOrUndo={"undo"}
          activities={activities}
          setActivities={setActivities}
          makeActivities={makeActivities}
          activitiesRef={activitiesRef}
        />
        {activities.map((activity, index) =>
          activity.is_archived ? (
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

export { ArchiveSwitch, ArchiveView };
