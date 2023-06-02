import {
  PhoneStyle,
  PhoneMissedCallsStyle,
  PhoneContainer,
  ControlBarStyle,
  ContactsStyle,
  ContactsContainer,
  GreenContainer,
  GridStyle,
  GridContainerStyle,
  SettingsStyle,
  SettingsContainer,
  DotStyle,
  DotContainer,
} from "../styled/ControlBarStyles";
import { useState } from "react";

const ControlBar = ({ activities }) => {
  const [activeBtn, setActiveBtn] = useState("phone");

  return (
    <ControlBarStyle>
      <PhoneContainer
        onClick={() => setActiveBtn("phone")}
        isActive={activeBtn === "phone"}
      >
        <PhoneStyle />
        {activities && (
          <PhoneMissedCallsStyle>
            {
              activities?.filter(
                (activity) =>
                  activity.call_type === "missed" &&
                  !activity.is_archived &&
                  activity.direction
              ).length
            }
          </PhoneMissedCallsStyle>
        )}
      </PhoneContainer>
      <ContactsContainer
        onClick={() => setActiveBtn("contacts")}
        isActive={activeBtn === "contacts"}
      >
        <ContactsStyle />
      </ContactsContainer>
      <GridContainerStyle>
        <GreenContainer>
          <GridStyle />
        </GreenContainer>
      </GridContainerStyle>
      <SettingsContainer
        onClick={() => setActiveBtn("settings")}
        isActive={activeBtn === "settings"}
      >
        <SettingsStyle />
      </SettingsContainer>
      <DotContainer
        onClick={() => setActiveBtn("dot")}
        isActive={activeBtn === "dot"}
      >
        <DotStyle />
      </DotContainer>
    </ControlBarStyle>
  );
};

export default ControlBar;
