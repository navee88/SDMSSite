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

import UploadQueue from "../../../Home/SubFolders/MonitorSchedular/UploadQueue";
import FailedQueue from "../../../Home/SubFolders/MonitorSchedular/FailedQueue";
import RestoreMonitor from "../../../Home/SubFolders/MonitorSchedular/RestoreMonitor";
import DownloadMonitor from "../../../Home/SubFolders/MonitorSchedular/DownloadMonitor";
import UploadMonitor from "../../../Home/SubFolders/MonitorSchedular/UploadMonitor";
import CFRSettings from "../../../Home/SubFolders/AuditTrailHistory/CFRSettings";
import AuditTrailHistory from "../../../Home/SubFolders/AuditTrailHistory/AuditTrailHistory";
import DownloadErrorLogs from "../../../Home/SubFolders/DownloadLogs/DownloadErrorLogs";
import DownloadLogs from "../../../Home/SubFolders/DownloadLogs/DownloadLogs";
import UploadErrorLogs from "../../../Home/SubFolders/UploadLogs/UploadErrorLogs";
import UploadLogs from "../../../Home/SubFolders/UploadLogs/UploadLogs";
import ManualUploadLogs from "../../../Home/SubFolders/UploadLogs/ManualUploadLogs";
import RestoreLogs from "../../../Home/SubFolders/RestoreLogs/RestoreLogs";
import RestoreErrorLogs from "../../../Home/SubFolders/RestoreLogs/RestoreErrorLogs";
import ServerFileDeleteLogs from "../../../Home/SubFolders/Server&LocalFileDeleteLogs/ServerFileDeleteLogs";
import LocalFileDeleteLogs from "../../../Home/SubFolders/Server&LocalFileDeleteLogs/LocalFileDeleteLogs";
import InstrumentLogs from "../../../Home/SubFolders/InstrumentLogs/InstrumentLogs";
import SchedulerConfigLogs from "../../../Home/SubFolders/SchedulerConfigLogs/SchedulerConfigLogs";
import AutoDownloadConfiguration from "../../../Home/SubFolders/DownloadSchedular/AutoDownloadConfiguration";
import ViewDownloadConfiguration from "../../../Home/SubFolders/DownloadSchedular/ViewDownloadConfiguration";

export const tabConfig = {
  //completed
  DataExplorer: {
    "Server Data": { content: <ServerData /> },
    "Template View": { content: <TemplateView /> },
    "Data Logger": { content: <DataLogger /> },
  },
    //completed
  SearchServerData: {
    "SearchServerData": { content: <SearchServerData /> }
  },
    //completed
  InstrumentLockSettings: {
    "Instrument Locks and Tags": { content: <InstrumentLockTag /> },
    "Data": { content: <InstrumentDataPage /> },
    "My Instruments": { content: <MyInstruments /> },
    "Other Instruments": { content: <OtherInstruments /> },
  },
  //completed
  MonitorSchedular: {
    "Upload Queue": { content: <MonitorScheduler /> },
    "Failed Queue": { content: <FailedQueue /> },
    "Upload Monitor": { content: <UploadMonitor /> },
    "Restore Monitor": { content: <RestoreMonitor /> },
    "Download Monitor": { content: <DownloadMonitor /> },
  },
  LocalFileScheduler:{
    "Local File Delete Scheduler": { content: <LocalFileDeleteScheduler /> },
  },
  ServerFileDeleteScheduler:{
    "Server File Delete Scheduler": { content: <DownloadMonitor /> },
  },
    //completed
  DownloadSchedular:{
    "Auto Download Configuration":{content:<AutoDownloadConfiguration/>},
    "View Download Configuration":{content:<ViewDownloadConfiguration/>}

  },
  ClientServiceMonitor:{
    "Client Service Monitor":{content:<AutoDownloadConfiguration/>},
  },
  BaseMaster:{
    "Domain": { content: <UploadLogs /> },
    "Client": { content: <UploadErrorLogs /> },
    "Instrument": { content: <ManualUploadLogs /> },
    "Site": { content: <UploadLogs /> },

  },
  TagsandTemplates:{
    "Tag Master": { content: <ManualUploadLogs /> },
    "Template Mapping": { content: <UploadLogs /> },
  },
  ParentParserKey:{
    "Parser Key": { content: <ManualUploadLogs /> },
  },
  Configuration:{
    "Server Configuration": { content: <UploadLogs /> },
    "Server Drive Configuration": { content: <UploadErrorLogs /> },
    "Storage Configuration": { content: <ManualUploadLogs /> },
  },
  Rights:{
    "Storage User Mapping": { content: <UploadLogs /> },
  },
  UserManagement:{
    "User Group": { content: <UploadLogs /> },
    "User Master": { content: <UploadErrorLogs /> },
    "User Rights": { content: <ManualUploadLogs /> },
    "Online Users": { content: <UploadLogs /> },
  },
  PasswordPolicy:{
    "Password Policy": { content: <UploadLogs /> },
  },
    //completed
  AuditTrailHistory: {
    "Audit Trail History": { content: <AuditTrailHistory /> },
    "CFR Settings": { content: <CFRSettings /> },
  },
    //completed
  DownloadLogs: {
    "Download Logs": { content: <DownloadLogs /> },
    "Download Error Logs": { content: <DownloadErrorLogs /> },
  },
    //completed
  UploadLogs: {
    "Upload Logs": { content: <UploadLogs /> },
    "Upload Error Logs": { content: <UploadErrorLogs /> },
    "Manual Upload Logs": { content: <ManualUploadLogs /> },
  },
    //completed
  RestoreLogs: {
    "Restore Logs": { content: <RestoreLogs /> },
    "Restore Error Logs": { content: <RestoreErrorLogs /> },
  },
    //completed
  ServerAndLocalFileDeleteLogs:{
     "Server File Delete Logs": { content: <ServerFileDeleteLogs /> },
    "Local File Delete Logs": { content: <LocalFileDeleteLogs /> },
  },
    //completed
  SchedulerConfigLogs:{
    "Scheduler Config Logs":{content:<SchedulerConfigLogs />}
  },
    //completed
  InstrumentLogs:{
    "InstrumentLogs":{content:<InstrumentLogs/>}
  },
};
