import InstrumentLockSettings from "../../../../Pages/Home/LockSettings/InstrumentLockSettings";
import DataLogger from "../../../Home/SubFolders/DataExplorer/DataLogger";
import ServerData from "../../../Home/SubFolders/DataExplorer/ServerData";
import TemplateView from "../../../Home/SubFolders/DataExplorer/TemplateView";
import SearchServerData from "../../../Home/SubFolders/SearchServerData/SearchServerData";
import MyInstruments from "../../../Home/SubFolders/InstrumentLockSettings/MyInstruments";
import OtherInstruments from "../../../Home/SubFolders/InstrumentLockSettings/OtherInstruments";
import InstrumentLockTag from "../../../Home/SubFolders/InstrumentLockSettings/InstrumentLocksandTags";
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
    "SearchServerData": { content: <SearchServerData /> }
  },
  InstrumentLockSettings: {
    "Instrument Locks and Tags": { content: <InstrumentLockTag /> },
    "Data": { content: <InstrumentDataPage /> },
    "My Instruments": { content: <MyInstruments /> },
    "Other Instruments": { content: <OtherInstruments /> },
  },
  MonitorSchedular: {
    "Upload Queue": { content: <UploadQueue /> },
    "Failed Queue": { content: <FailedQueue /> },
    "Upload Monitor": { content: <UploadMonitor /> },
    "Restore Monitor": { content: <RestoreMonitor /> },
    "Download Monitor": { content: <DownloadMonitor /> },
  },
  AuditTrailHistory: {
    "Audit Trail History": { content: <AuditTrailHistory /> },
    "CFR Settings": { content: <CFRSettings /> },
  },
  DownloadLogs: {
    "Download Logs": { content: <DownloadLogs /> },
    "Download Error Logs": { content: <DownloadErrorLogs /> },
  },
  UploadLogs: {
    "Upload Logs": { content: <UploadLogs /> },
    "Upload Error Logs": { content: <UploadErrorLogs /> },
    "Manual Upload Logs": { content: <ManualUploadLogs /> },
  },
  RestoreLogs: {
    "Restore Logs": { content: <RestoreLogs /> },
    "Restore Error Logs": { content: <RestoreErrorLogs /> },
  },
  ServerAndLocalFileDeleteLogs:{
     "Server File Delete Logs": { content: <ServerFileDeleteLogs /> },
    "Local File Delete Logs": { content: <LocalFileDeleteLogs /> },
  },
  SchedulerConfigLogs:{
    "Scheduler Config. Logs":{content:<SchedulerConfigLogs />}
  },
  InstrumentLogs:{
    "InstrumentLogs":{content:<InstrumentLogs/>}
  }

};
