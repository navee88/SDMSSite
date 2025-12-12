import InstrumentLockSettings from "../../../../Pages/Home/LockSettings/InstrumentLockSettings";
import DataLogger from "../../../Home/SubFolders/DataExplorer/DataLogger";
import ServerData from "../../../Home/SubFolders/DataExplorer/ServerData";
import TemplateView from "../../../Home/SubFolders/DataExplorer/TemplateView";
import SearchServerData from "../../../Home/SubFolders/SearchServerData/SearchServerData";
import InstrumentLocksAndTags from "../../../Home/SubFolders/InstrumentLockSettings/InstrumentLocksandTags";
import Data from "../../../Home/SubFolders/InstrumentLockSettings/Data";
import MyInstruments from "../../../Home/SubFolders/InstrumentLockSettings/MyInstruments";
import OtherInstruments from "../../../Home/SubFolders/InstrumentLockSettings/OtherInstruments";


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
    "Instrument Locks and Tags": { content: <InstrumentLocksAndTags /> },
    "Data": { content: <Data /> },
    "My Instruments": { content: <MyInstruments /> },
    "Other Instruments": { content: <OtherInstruments /> },


  }
};
