import InstrumentLockSettings from "../../../../Pages/Home/LockSettings/InstrumentLockSettings";
import DataLogger from "../../../Home/SubFolders/DataExplorer/DataLogger";
import ServerData from "../../../Home/SubFolders/DataExplorer/ServerData";
import TemplateView from "../../../Home/SubFolders/DataExplorer/TemplateView";
import SearchServerData from "../../../Home/SubFolders/SearchServerData/SearchServerData";
import MyInstruments from "../../../Home/SubFolders/InstrumentLockSettings/MyInstruments";
import OtherInstruments from "../../../Home/SubFolders/InstrumentLockSettings/OtherInstruments";
import InstrumentLockTag from "../../../Home/SubFolders/InstrumentLockSettings/InstrumentLocksandTags";
import InstrumentDataPage from "../../../Home/SubFolders/InstrumentLockSettings/Data";

import UploadQueue from "../../../Home/SubFolders/Scheduler/MonitorScheduler/UploadQueue";
import FailedQueue from "../../../Home/SubFolders/Scheduler/MonitorScheduler/FailedQueue";
import RestoreMonitor from "../../../Home/SubFolders/Scheduler/MonitorScheduler/RestoreMonitor";
import DownloadMonitor from "../../../Home/SubFolders/Scheduler/MonitorScheduler/DownloadMonitor";
import UploadMonitor from "../../../Home/SubFolders/Scheduler/MonitorScheduler/UploadMonitor";
import CFRSettings from "../../../Home/SubFolders/LogHistory/AuditTrailHistory/CFRSettings";
import AuditTrailHistory from "../../../Home/SubFolders/LogHistory/AuditTrailHistory/AuditTrailHistory";
import DownloadErrorLogs from "../../../Home/SubFolders/LogHistory/DownloadLogs/DownloadErrorLogs";
import DownloadLogs from "../../../Home/SubFolders/LogHistory/DownloadLogs/DownloadLogs";
import UploadErrorLogs from "../../../Home/SubFolders/LogHistory/UploadLogs/UploadErrorLogs";
import UploadLogs from "../../../Home/SubFolders/LogHistory/UploadLogs/UploadLogs";
import ManualUploadLogs from "../../../Home/SubFolders/LogHistory/UploadLogs/ManualUploadLogs";
import RestoreLogs from "../../../Home/SubFolders/LogHistory/RestoreLogs/RestoreLogs";
import RestoreErrorLogs from "../../../Home/SubFolders/LogHistory/RestoreLogs/RestoreErrorLogs";
import ServerFileDeleteLogs from "../../../Home/SubFolders/LogHistory/Server&LocalFileDeleteLogs/ServerFileDeleteLogs";
import LocalFileDeleteLogs from "../../../Home/SubFolders/LogHistory/Server&LocalFileDeleteLogs/LocalFileDeleteLogs";
import InstrumentLogs from "../../../Home/SubFolders/LogHistory/InstrumentLogs/InstrumentLogs";
import SchedulerConfigLogs from "../../../Home/SubFolders/LogHistory/SchedulerConfigLogs/SchedulerConfigLogs";
import AutoDownloadConfiguration from "../../../Home/SubFolders/Scheduler/DownloadScheduler/AutoDownloadConfiguration";
import ViewDownloadConfiguration from "../../../Home/SubFolders/Scheduler/DownloadScheduler/ViewDownloadConfiguration";

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
  MonitorScheduler: {
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
  },
  DownloadSchedular:{
    "Auto Download Configuration":{content:<AutoDownloadConfiguration/>},
    "View Download Configuration":{content:<ViewDownloadConfiguration/>}

  }

};
