import InstrumentLockSettings from "../../../../Pages/Home/LockSettings/InstrumentLockSettings";
import DataLogger from "../../../Home/SubFolders/DataExplorer/DataLogger";
import ServerData from "../../../Home/SubFolders/DataExplorer/ServerData";
import TemplateView from "../../../Home/SubFolders/DataExplorer/TemplateView";
import SearchServerData from "../../../Home/SubFolders/SearchServerData/SearchServerData";
import Data from "../../../Home/SubFolders/InstrumentLockSettings/Data";
import MyInstruments from "../../../Home/SubFolders/InstrumentLockSettings/MyInstruments";
import OtherInstruments from "../../../Home/SubFolders/InstrumentLockSettings/OtherInstruments";
import InstrumentLockTag from "../../../Home/SubFolders/InstrumentLockSettings/InstrumentLocksandTags";
import MonitorSchedular from "../../../../Pages/Home/Schedular/MonitorSchedular";
import UploadQueue from "../../../Home/SubFolders/MonitorSchedular/UploadQueue";
import FailedQueue from "../../../Home/SubFolders/MonitorSchedular/FailedQueue";
import RestoreMonitor from "../../../Home/SubFolders/MonitorSchedular/RestoreMonitor";
import DownloadMonitor from "../../../Home/SubFolders/MonitorSchedular/DownloadMonitor";
import UploadMonitor from "../../../Home/SubFolders/MonitorSchedular/UploadMonitor";

export const tabConfig = {
  DataExplorer: {
    "Server Data": { content: <ServerData /> },
    "Template View": { content: <TemplateView /> },
    "Data Logger": { content: <DataLogger /> },
  },
  SearchServerData: {
    "SearchServerData" : {content: <SearchServerData />}
  },
  InstrumentLockSettings:{
    "Instrument Locks and Tags": { content: <InstrumentLockTag /> },
    "Data": { content: <Data /> },
    "My Instruments": { content: <MyInstruments /> },
    "Other Instruments": { content: <OtherInstruments /> },


  },
  MonitorSchedular:{
    "Upload Queue": { content: <UploadQueue /> },
    "Failed Queue": { content: <FailedQueue /> },
    "Upload Monitor":{content: <UploadMonitor/>},
    "Restore Monitor": { content: <RestoreMonitor /> },
    "Download Monitor": { content: <DownloadMonitor /> },
  }


};
