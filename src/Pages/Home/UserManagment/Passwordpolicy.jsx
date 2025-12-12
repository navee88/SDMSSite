import React from 'react'

function Passwordpolicy() {
  return (
    <div>Passwordpolicy</div>
  )
}

export default Passwordpolicy






// import React, { useState, useEffect, useCallback } from "react";
// import { useTranslation } from "react-i18next";
// import { motion, AnimatePresence } from "framer-motion";
// import { CheckSquare, Save, Radio } from "lucide-react";
// import servicecall from "../../../Services/servicecall";
// import { useLanguage } from "../../../Context/LanguageContext";
// import { useML } from "../../../Services/useML";
// import { CF_sessionSet, CF_sessionGet } from "../../../Components/Common/CF_session";
// import Errordialog from "../../../Components/Layout/Common/Errordialog";

// const PasswordPolicy = ({ onClose }) => {
//   const { t } = useTranslation();
//   const { currentLanguage } = useLanguage();
//   const applyML = useML();
//   const { postData } = servicecall();

//   // State matching jQuery functionality
//   const [dbLogin, setDbLogin] = useState(true);
//   const [domainLogin, setDomainLogin] = useState(false);
//   const [complexPolicy, setComplexPolicy] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [editRights, setEditRights] = useState(true);
//   const [auditTrailRights, setAuditTrailRights] = useState(0);
  
//   // Dialog state following your pattern
//   const [dialogData, setDialogData] = useState({
//     open: false,
//     message: "",
//     type: "",
//   });

//   // Policy state matching jQuery structure
//   const [policyData, setPolicyData] = useState({
//     nMinPasswrdLength: 4,
//     nMaxPasswrdLength: 10,
//     nPasswordHistory: 5,
//     nPasswordExpiry: 90,
//     nLockPolicy: 3,
//     nMinCapitalChar: 0,
//     nMinSmallChar: 0,
//     nMinNumericChar: 0,
//     nMinSpecialChar: 0,
//     nComplexPasswrd: 0,
//     nDBBased: 1
//   });

//   // Validation state
//   const [validationErrors, setValidationErrors] = useState({
//     minLength: false,
//     maxLength: false,
//     passwordHistory: false,
//     passwordExpiry: false,
//     lockPolicy: false
//   });

//   // Dialog handlers following your pattern
//   const showDialog = useCallback((message, type = "error") => {
//     setDialogData({ open: true, message, type });
//   }, []);

//   const handleDialogClose = useCallback(() => {
//     setDialogData({ open: false, message: "", type: "" });
//   }, []);

//   // Validation functions matching jQuery validation
//   const validatePasswordLength = useCallback((value) => {
//     const num = parseInt(value);
//     return num >= 4 && num <= 20;
//   }, []);

//   const validateHistoryLock = useCallback((value) => {
//     const num = parseInt(value);
//     return num >= 1 && num <= 5;
//   }, []);

//   const validatePasswordExpiry = useCallback((value) => {
//     const num = parseInt(value);
//     return num >= 1 && num <= 180;
//   }, []);

//   const validateComplexPassword = useCallback((value) => {
//     const num = parseInt(value);
//     return num >= 0;
//   }, []);

//   // Input change handler with validation
//   const handleInputChange = useCallback((field, value) => {
//     const numValue = parseInt(value) || 0;
    
//     // Clear validation error
//     setValidationErrors(prev => ({
//       ...prev,
//       [field]: false
//     }));

//     // Update policy data
//     setPolicyData(prev => ({
//       ...prev,
//       [field]: numValue
//     }));
//   }, []);

//   // Input blur handler for validation (matching jQuery onfocusout)
//   const handleInputBlur = useCallback((field, value) => {
//     let isValid = true;
    
//     switch(field) {
//       case 'nMinPasswrdLength':
//       case 'nMaxPasswrdLength':
//         isValid = validatePasswordLength(value);
//         break;
//       case 'nPasswordHistory':
//       case 'nLockPolicy':
//         isValid = validateHistoryLock(value);
//         break;
//       case 'nPasswordExpiry':
//         isValid = validatePasswordExpiry(value);
//         break;
//       case 'nMinCapitalChar':
//       case 'nMinSmallChar':
//       case 'nMinNumericChar':
//       case 'nMinSpecialChar':
//         isValid = validateComplexPassword(value);
//         break;
//       default:
//         isValid = true;
//     }

//     if (!isValid) {
//       setValidationErrors(prev => ({
//         ...prev,
//         [field]: true
//       }));
//     }
//   }, [validatePasswordLength, validateHistoryLock, validatePasswordExpiry, validateComplexPassword]);

//   // Load policy data from API
//   const loadPolicyData = useCallback(async () => {
//     setLoading(true);
//     try {
//       const response = await postData("User/GetPasswordPolicy", {});
      
//       if (response) {
//         setPolicyData({
//           nMinPasswrdLength: response.nMinPasswrdLength || 4,
//           nMaxPasswrdLength: response.nMaxPasswrdLength || 10,
//           nPasswordHistory: response.nPasswordHistory || 5,
//           nPasswordExpiry: response.nPasswordExpiry || 90,
//           nLockPolicy: response.nLockPolicy || 3,
//           nMinCapitalChar: response.nMinCapitalChar || 0,
//           nMinSmallChar: response.nMinSmallChar || 0,
//           nMinNumericChar: response.nMinNumericChar || 0,
//           nMinSpecialChar: response.nMinSpecialChar || 0,
//           nComplexPasswrd: response.nComplexPasswrd ? 1 : 0,
//           nDBBased: response.DBBased ? 1 : 0
//         });

//         setComplexPolicy(response.nComplexPasswrd === true);
//         setDbLogin(response.DBBased === true);
//         setDomainLogin(response.DomainBased === true);
//       }
//     } catch (error) {
//       console.error("Error loading password policy:", error);
//       showDialog(t('passwordpolicy.loaderror'), "error");
//     } finally {
//       setLoading(false);
//     }
//   }, [postData, showDialog, t]);

//   // Load user rights (matching jQuery control-rights logic)
//   const loadUserRights = useCallback(() => {
//     // This would typically come from your session or API
//     // For now, we'll use a mock based on jQuery logic
//     const controlRights = true; // Would come from your session/user context
//     if (controlRights) {
//       // In jQuery: rightsObject.sEdit == "1"
//       setEditRights(true);
//     } else {
//       setEditRights(false);
//     }

//     // Load audit trail rights (matching jQuery logic)
//     // This would come from your API
//     setTimeout(() => {
//       setAuditTrailRights(1); // Mock value - would be from auditTrailObject[i].nManualAuditTrail
//     }, 100); // Simulating jQuery setTimeout
//   }, []);

//   // Save handler with audit trail support
//   const handleSave = useCallback(async () => {
//     // Validation check (matching jQuery ISEmpyt logic)
//     const errors = {};
//     let hasErrors = false;

//     if (!policyData.nMinPasswrdLength) {
//       errors.minLength = true;
//       hasErrors = true;
//     }
//     if (!policyData.nMaxPasswrdLength) {
//       errors.maxLength = true;
//       hasErrors = true;
//     }
//     if (!policyData.nPasswordHistory) {
//       errors.passwordHistory = true;
//       hasErrors = true;
//     }
//     if (!policyData.nPasswordExpiry) {
//       errors.passwordExpiry = true;
//       hasErrors = true;
//     }
//     if (!policyData.nLockPolicy) {
//       errors.lockPolicy = true;
//       hasErrors = true;
//     }

//     // Set zero values for complex password fields if empty (matching jQuery logic)
//     const finalData = {
//       ...policyData,
//       nMinCapitalChar: policyData.nMinCapitalChar || 0,
//       nMinSmallChar: policyData.nMinSmallChar || 0,
//       nMinNumericChar: policyData.nMinNumericChar || 0,
//       nMinSpecialChar: policyData.nMinSpecialChar || 0,
//       nComplexPasswrd: complexPolicy ? 1 : 0,
//       nDBBased: dbLogin ? 1 : 0
//     };

//     if (hasErrors) {
//       setValidationErrors(errors);
//       showDialog(t('passwordpolicy.validationerror'), "error");
//       return;
//     }

//     setValidationErrors({});

//     setSaving(true);
//     try {
//       // Prepare request object matching jQuery structure
//       const requestData = {
//         pswdObj: finalData
//       };

//       // Check audit trail rights (matching jQuery logic)
//       if (auditTrailRights === 1) {
//         // Show audit trail modal - you'll need to implement this
//         // For now, we'll call save directly
//         await savePolicy(requestData);
//       } else {
//         await savePolicy(requestData);
//       }
//     } catch (error) {
//       console.error("Error saving password policy:", error);
//       showDialog(t('passwordpolicy.saveerror'), "error");
//     } finally {
//       setSaving(false);
//     }
//   }, [policyData, complexPolicy, dbLogin, auditTrailRights, showDialog, t]);

//   // Actual save function
//   const savePolicy = useCallback(async (requestData) => {
//     try {
//       const response = await postData("User/PasswordpolicySave", requestData);
      
//       if (response?.AuditTrailLogin === false) {
//         showDialog(applyML(response.LoginFailedMsg), "error");
//         return;
//       }

//       if (response?.oResObj?.bStatus === true) {
//         showDialog(applyML(response.oResObj.sInformation), "success");
//       } else {
//         showDialog(applyML(response?.oResObj?.sInformation || t('passwordpolicy.saveerror')), "warning");
//       }
//     } catch (error) {
//       throw error;
//     }
//   }, [postData, showDialog, applyML, t]);

//   // Initialize on component mount
//   useEffect(() => {
//     loadPolicyData();
//     loadUserRights();
//   }, [loadPolicyData, loadUserRights]);

//   // Handle radio button changes
//   const handleLoginTypeChange = useCallback((type) => {
//     if (type === 'db') {
//       setDbLogin(true);
//       setDomainLogin(false);
//     } else {
//       setDbLogin(false);
//       setDomainLogin(true);
//     }
//   }, []);

//   // Get device type (matching jQuery logic)
//   const deviceName = CF_sessionGet("device") || "desktop";

//   return (
//     <>
//       {/* Main Container */}
//       <div className="fixed top-[60px] left-[60px] w-[calc(100%-60px)] h-[calc(100vh-60px)] bg-[#f1f5f9] flex flex-col">
        
//         {/* Header with Save button (matching jQuery layout) */}
//         <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-slate-300">
//           {/* Tab/Title area */}
//           <div className="flex items-center gap-8">
//             <button className="text-lg font-semibold text-blue-800 pb-1 border-b-2 border-blue-600">
//               {applyML("passwordpolicy")}
//             </button>
//           </div>

//           {/* Save Button (positioned like jQuery) */}
//           {editRights && (
//             <button
//               onClick={handleSave}
//               disabled={saving || loading}
//               className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-bold transition-all hover:scale-95
//                 ${saving || loading 
//                   ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
//                   : 'bg-[#f3f4f6] text-blue-600 hover:bg-blue-50'
//                 }`}
//             >
//               <Save className="w-4 h-4" />
//               {saving ? applyML("saving") : applyML("save")}
//             </button>
//           )}
//         </div>

//         {/* Main Content Area */}
//         <div className="flex-1 p-4 overflow-auto">
//           <div className="flex flex-wrap gap-8">
//             {/* Left Column - Basic Settings */}
//             <div className="flex-1 min-w-[300px] max-w-[400px]">
//               {/* Login Type Radio Buttons */}
//               <div className="mb-6">
//                 <div className="flex items-center gap-4 mb-4">
//                   <div className="flex items-center gap-2">
//                     <button
//                       onClick={() => handleLoginTypeChange('db')}
//                       className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${dbLogin ? 'border-blue-600' : 'border-slate-400'}`}
//                     >
//                       {dbLogin && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
//                     </button>
//                     <span className="text-sm font-semibold text-slate-700">
//                       {applyML("databasebasedlogin")}
//                     </span>
//                   </div>
//                   {/* Domain based is hidden in jQuery, keeping for consistency */}
//                   <div className="flex items-center gap-2 invisible">
//                     <button
//                       onClick={() => handleLoginTypeChange('domain')}
//                       className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${domainLogin ? 'border-blue-600' : 'border-slate-400'}`}
//                     >
//                       {domainLogin && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
//                     </button>
//                     <span className="text-sm font-semibold text-slate-700">
//                       {applyML("ftpusermappingview")}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Password Policy Inputs */}
//                 <div className="space-y-4">
//                   {[
//                     { 
//                       key: 'nMinPasswrdLength', 
//                       label: 'minimumpasswordlength',
//                       validation: validationErrors.minLength
//                     },
//                     { 
//                       key: 'nMaxPasswrdLength', 
//                       label: 'maximumpasswordlength',
//                       validation: validationErrors.maxLength
//                     },
//                     { 
//                       key: 'nPasswordHistory', 
//                       label: 'passwordhistory',
//                       validation: validationErrors.passwordHistory
//                     },
//                     { 
//                       key: 'nPasswordExpiry', 
//                       label: 'passwordexpiry',
//                       validation: validationErrors.passwordExpiry
//                     },
//                     { 
//                       key: 'nLockPolicy', 
//                       label: 'autolockpolicy',
//                       validation: validationErrors.lockPolicy
//                     }
//                   ].map((item) => (
//                     <div key={item.key} className="flex flex-col">
//                       <label className="text-xs font-semibold text-slate-600 mb-1">
//                         {applyML(item.label)}
//                       </label>
//                       <input
//                         type="number"
//                         value={policyData[item.key]}
//                         onChange={(e) => handleInputChange(item.key, e.target.value)}
//                         onBlur={(e) => handleInputBlur(item.key, e.target.value)}
//                         className={`w-full border-b-2 pb-1 text-sm font-semibold text-slate-800 focus:outline-none bg-transparent
//                           ${item.validation 
//                             ? 'border-red-500 focus:border-red-500' 
//                             : 'border-slate-300 focus:border-blue-500'
//                           }`}
//                         disabled={!editRights}
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Right Column - Complex Password Policy */}
//             <div className="flex-1 min-w-[300px]">
//               <div className="text-center mb-6">
//                 <h2 className="text-lg font-bold text-blue-800 mb-2">
//                   {applyML("complexpasswordpolicy")}
//                 </h2>
                
//                 <div className="flex items-center justify-center gap-2 mb-4">
//                   <span className="text-sm font-semibold text-slate-600">
//                     {applyML("complexpasswordpolicy")}
//                   </span>
//                   <button
//                     onClick={() => setComplexPolicy(!complexPolicy)}
//                     disabled={!editRights}
//                     className={`w-5 h-5 border rounded flex items-center justify-center transition-colors ${!editRights ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
//                       ${complexPolicy ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-400'}`}
//                   >
//                     {complexPolicy && <CheckSquare className="w-3 h-3 text-white" />}
//                   </button>
//                 </div>

//                 {/* Complex Policy Options */}
//                 <AnimatePresence>
//                   {complexPolicy && (
//                     <motion.div
//                       initial={{ height: 0, opacity: 0 }}
//                       animate={{ height: "auto", opacity: 1 }}
//                       exit={{ height: 0, opacity: 0 }}
//                       className="flex flex-col gap-4 items-center"
//                     >
//                       {/* Note Box */}
//                       <div className="w-full max-w-md px-3 py-2 bg-yellow-100 border-l-4 border-yellow-500">
//                         <p className="text-xs font-semibold text-slate-700">
//                           {applyML("complexpolicynote")}
//                         </p>
//                       </div>

//                       {/* Complex Policy Inputs */}
//                       {[
//                         { key: 'nMinCapitalChar', label: 'minimumnumberofcapitalcharcter' },
//                         { key: 'nMinSmallChar', label: 'minimumnumberofsmallcharcter' },
//                         { key: 'nMinNumericChar', label: 'minimumnumberofnumericcharcter' },
//                         { key: 'nMinSpecialChar', label: 'minimumnumberofspecialcharcter' }
//                       ].map((item) => (
//                         <div key={item.key} className="w-full max-w-md">
//                           <label className="text-xs font-semibold text-slate-600 mb-1 block">
//                             {applyML(item.label)}
//                           </label>
//                           <input
//                             type="number"
//                             min="0"
//                             value={policyData[item.key]}
//                             onChange={(e) => handleInputChange(item.key, e.target.value)}
//                             onBlur={(e) => handleInputBlur(item.key, e.target.value)}
//                             className="w-full border-b-2 border-slate-300 pb-1 text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500 bg-transparent"
//                             disabled={!editRights}
//                           />
//                         </div>
//                       ))}
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Error Dialog */}
//       {dialogData.open && (
//         <Errordialog 
//           message={dialogData.message} 
//           type={dialogData.type} 
//           onClose={handleDialogClose} 
//         />
//       )}

//       {/* Loading Overlay */}
//       {(loading || saving) && (
//         <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center gap-3">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//             <p className="text-sm font-semibold text-slate-700">
//               {loading ? applyML("loading") : applyML("saving")}...
//             </p>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default PasswordPolicy;





// import React, { useState } from "react";
// import { useTranslation } from "react-i18next";
// import { motion, AnimatePresence } from "framer-motion";
// import { CheckSquare, Save } from "lucide-react";
// import servicecall from "../../../Services/servicecall";
// import { useLanguage } from "../../../Context/LanguageContext";
// import { useML } from "../../../Services/useML";
// const PasswordPolicy = ({ onClose }) => {
//   const { t } = useTranslation();
//   const { currentLanguage } = useLanguage();
//   const applyML = useML();
//   const { postData } = servicecall();

//   // State
//   const [dbLogin, setDbLogin] = useState(true);
//   const [complexPolicy, setComplexPolicy] = useState(false);
//   const [loading, setLoading] = useState(false);
  
//   // Dialog state following your pattern
//   const [dialogData, setDialogData] = useState({
//     open: false,
//     message: "",
//     type: "",
//   });

//   // Policy state
//   const [policyData, setPolicyData] = useState({
//     minLength: 4,
//     maxLength: 10,
//     passwordHistory: 5,
//     passwordExpiry: 90,
//     autolockPolicy: 3,
//     minUppercase: 0,
//     minLowercase: 0,
//     minNumeric: 0,
//     minSpecial: 0
//   });

//   // Dialog handlers following your pattern
//   const showDialog = React.useCallback((message, type = "error") => {
//     setDialogData({ open: true, message, type });
//   }, []);

//   const handleDialogClose = React.useCallback(() => {
//     setDialogData({ open: false, message: "", type: "" });
//   }, []);

//   // Input change handler
//   const handleInputChange = React.useCallback((field, value) => {
//     const numValue = parseInt(value) || 0;
//     setPolicyData(prev => ({
//       ...prev,
//       [field]: numValue
//     }));
//   }, []);

//   // Save handler
//   const handleSave = React.useCallback(async () => {
//     setLoading(true);
//     try {
//       // API call would go here
//       // const response = await postData("PasswordPolicy/Save", policyData);
//       showDialog(t('passwordpolicy.saved'), "success");
//     } catch (error) {
//       showDialog(t('passwordpolicy.saveerror'), "error");
//     } finally {
//       setLoading(false);
//     }
//   }, [policyData, postData, showDialog, t]);

//   // Tab labels (single tab in this case)
//   const tabLabels = [t('Password Policy')];

//   return (
//     <>
//       {/* Main Container */}
//       <div className="fixed top-[60px] left-[60px] w-[calc(100%-60px)] h-[calc(100vh-60px)] bg-[#f1f5f9] flex flex-col">
        
//         {/* Tabs Section */}
//         <div className="px-4 py-2 border-b border-slate-300 bg-lightblue-50">
//           <div className="flex items-center gap-8">
//             {tabLabels.map((label, idx) => (
//               <button
//                 key={idx}
//                 className="text-lg font-semibold text-blue-800 pb-1 border-b-2 border-blue-600 transition-colors hover:text-blue-700"
//               >
//                 {label}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Main Content Area */}
//         <div className="flex-1 bg-white m-0  shadow-sm p-4 relative">
          
//           {/* Top Row: Database Login & Save Button */}
//           <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
//             {/* Database Login Toggle */}
//             <div className="flex items-center gap-2">
//               <span className="text-xs font-semibold text-slate-600">
//                 {t('Database Based Login')}
//               </span>
//               <button
//                 onClick={() => setDbLogin(!dbLogin)}
//                 className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${dbLogin ? 'bg-blue-600' : 'bg-slate-300'}`}
//               >
//                 <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${dbLogin ? 'translate-x-6' : 'translate-x-1'}`} />
//               </button>
//             </div>

//             {/* Save Button */}
//             <button
//               onClick={handleSave}
//               disabled={loading}
//               className="flex items-center gap-1.5 px-4 py-1.5 bg-[#f3f4f6] text-blue-600 text-xs font-bold rounded hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
//             >
//               <Save className="w-3.5 h-3.5" />
//               {loading ? t('saving') : t('save')}
//             </button>
//           </div>

//           {/* Complex Password Policy Section - Centered */}
//           <div className="absolute top-15 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
//             <h2 className="text-lg font-bold text-blue-800 mb-1">
//               {t('Complex Password Policy')}
//             </h2>
            
//             <div className="flex items-center gap-2 ">
//               <span className="text-xs font-semibold text-slate-600">
//                 {t('Complex password policy')}
//               </span>
//               <button
//                 onClick={() => setComplexPolicy(!complexPolicy)}
//                 className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${complexPolicy ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-400'}`}
//               >
//                 {complexPolicy && <CheckSquare className="w-3 h-3 text-white" />}
//               </button>
//             </div>

//             {/* Complex Policy Options */}
//             <AnimatePresence>
//               {complexPolicy && (
//                 <motion.div
//                   initial={{ height: 0, opacity: 0 }}
//                   animate={{ height: "auto", opacity: 1 }}
//                   exit={{ height: 0, opacity: 0 }}
//                   className="mt-2 flex flex-col gap-5 w-full max-w "
//                 >
//                   {/* Note Box */}
//                   <div className="px-1 py-1 bg-yellow-100/80 border-l-4 border-yellow-500">
//                     <p className="text-xs font-semibold text-slate-700">
//                       {t(' NOTE:- The total length of complex password must be greater than or equal to minimum password length and less than or equal to maximum password length.')}
//                     </p>
//                   </div>

//                   {/* Complex Policy Inputs */}
//                   {[
//                     { key: 'minUppercase', label: 'Minimum number of Uppercase characters' },
//                     { key: 'minLowercase', label: 'Minimum number of Lowercase characters' },
//                     { key: 'minNumeric', label: 'Minimum number of Numeric characters' },
//                     { key: 'minSpecial', label: 'Minimum number of Special characters' }
//                   ].map((item) => (
//                     <div key={item.key} className="flex flex-col">
//                       <label className="text-xs font-semibold text-slate-600 mb-1">
//                         {t(item.label)}
//                       </label>
//                       <input
//                         type="number"
//                         min="0"
//                         max="20"
//                         value={policyData[item.key]}
//                         onChange={(e) => handleInputChange(item.key, e.target.value)}
//                         className="w-full max-w-xs border-b-2 border-slate-300 pb-1 text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500 bg-transparent"
//                       />
//                     </div>
//                   ))}
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>

//           {/* Left Side Inputs */}
//           <div className="flex flex-col gap-4 mt-5">
//             {[
//               { key: 'minLength', label: 'Minimum Password Length(Between 4 and 20 Characters)', min: 4, max: 20 },
//               { key: 'maxLength', label: 'Maximum Password Length(Between 4 and 20 Characters)', min: 4, max: 20 },
//               { key: 'passwordHistory', label: 'Password History(Between 1 and 5 Times)', min: 1, max: 5 },
//               { key: 'passwordExpiry', label: 'Password Expiry(Between 1 and 180 Days)', min: 1, max: 180 },
//               { key: 'autolockPolicy', label: 'Autolock Policy(Between 1 and 5 Times)', min: 1, max: 5 }
//             ].map((item) => (
//               <div key={item.key} className="flex flex-col">
//                 <label className="text-xs font-semibold text-slate-600 mb-1">
//                   {t(item.label)}
//                 </label>
//                 <input
//                   type="number"
//                   min={item.min}
//                   max={item.max}
//                   value={policyData[item.key]}
//                   onChange={(e) => handleInputChange(item.key, e.target.value)}
//                   className="w-full max-w-xs border-b-2 border-slate-300 pb-1 text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500 bg-transparent"
//                 />
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Close Button (if needed) */}
//       {onClose && (
//         <button
//           onClick={onClose}
//           className="absolute top-2 right-2 text-slate-500 hover:text-slate-700"
//         >
//           <span className="sr-only">{t('button.close')}</span>
//           ×
//         </button>
//       )}
//     </>
//   );
// };

// export default PasswordPolicy;