import { LiaFolderOpen } from "react-icons/lia";
import { LuFileSearch } from "react-icons/lu";
import { GiPadlock } from "react-icons/gi";
import { RiCalendarScheduleLine, RiFileCloudLine } from "react-icons/ri";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSitemap } from "@fortawesome/free-solid-svg-icons";
import { FaUser, FaCog } from "react-icons/fa";



import DataExplorer from "../../../../Pages/Home/FTP/DataExplorer";
import Searchserverdata from "../../../../Pages/Home/FTP/Searchserverdata";
import UserManagment from "../../../../Pages/Home/UserManagment/UserManagment";
import Passwordpolicy from "../../../../Pages/Home/UserManagment/Passwordpolicy";
import InstrumentLockSettings from "../../../../Pages/Home/LockSettings/InstrumentLockSettings";


export const menuConfig = [
  {
    icon: <LiaFolderOpen />,
    label: "FTP Data View",
    subItems: [
      { label: "Data Explorer", content: <DataExplorer /> },
      { label: "Search Server Data", content: <Searchserverdata /> },
    ],
  },

  {
    icon: <GiPadlock />,
    label: "Lock Settings",
    subItems: [
      { label: "Instrument Lock Settings", content: <InstrumentLockSettings/> },
    ],
  },

  {
    icon: <RiCalendarScheduleLine />,
    label: "Scheduler",
    subItems: [
      { label: "Data Scheduler", content: <div>Data Scheduler</div> },
      { label: "View Edit Scheduler", content: <div>View Edit Scheduler</div> },
      { label: "Monitor Scheduler", content: <div>Monitor Scheduler</div> },
      { label: "Local File Delete Scheduler", content: <div>Local File Delete Scheduler</div> },
      { label: "Server File Delete Scheduler", content: <div>Server File Delete Scheduler</div> },
      { label: "Download Scheduler", content: <div>Download Scheduler</div> },
      { label: "Client Service Monitor", content: <div>Client Service Monitor</div> },
    ],
  },

  {
    icon: <FontAwesomeIcon icon={faSitemap} />,
    label: "Masters",
    subItems: [
      { label: "Base Master", content: <div>Base Master</div> },
      { label: "Tags and Templates", content: <div>Tags and Templates</div> },
      { label: "Parent Parser Key", content: <div>Parent Parser Key</div> },
    ],
  },

  {
    icon: <RiFileCloudLine />,
    label: "Storage",
    subItems: [
      { label: "Configuration", content: <div>Configuration</div> },
      { label: "Rights", content: <div>Rights</div> },
    ],
  },

  {
    icon: <FaUser />,
    label: "User Management",
    subItems: [
      { label: "User Management", content: <UserManagment /> },
      { label: "Password Policy", content: <Passwordpolicy /> },
    ],
  },

  {
    icon: <LuFileSearch />,
    label: "Log History",
    subItems: [
      { label: "Audit Trail History", content: <div>Audit Trail History</div> },
      { label: "Download Logs", content: <div>Download Logs</div> },
      { label: "Upload Logs", content: <div>Upload Logs</div> },
      { label: "Restore Logs", content: <div>Restore Logs</div> },
      { label: "Server & Local File Delete", content: <div>Server & Local File Delete</div> },
      { label: "Logs", content: <div>Logs</div> },
      { label: "Scheduler Config. Logs", content: <div>Scheduler Config. Logs</div> },
      { label: "Instrument Logs", content: <div>Instrument Logs</div> },
    ],
  },

  {
    icon: <FaCog />,
    label: "Settings",
    subItems: [
      { label: "Preferences", content: <div>Preferences</div> },
      { label: "License Information", content: <div>License Information</div> },
      { label: "Workflow Setup", content: <div>Workflow Setup</div> },
      { label: "Audit Trail Configuration", content: <div>Audit Trail Configuration</div> },
      { label: "Maintenance", content: <div>Maintenance</div> },
    ],
  },
];
