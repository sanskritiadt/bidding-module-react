import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setAuthorization } from "../helpers/api_helper";

const Navdata = () => {
    const history = useNavigate();
    //state data
    const [isDashboard, setIsDashboard] = useState(false);
    const [isIndentSummary, setIsIndentSummary] = useState(false);
    const [isIndentDiversion, setIsIndentDiversion] = useState(false);
    const [isIndentCancellation, setIsIndentCancellation] = useState(false);
    const [isPassword, setIsPassword] = useState(false);
    const [isApps, setIsApps] = useState(false);
    const [isMaster, setIsMaster] = useState(false);
    const [isReport, setIsReport] = useState(false);
    const [isSequencing, setIsSequencing] = useState(false);
    const [isConfiguration, setIsConfiguration] = useState(false);
    const [isLive, setIsLive] = useState(false);
    const [isJBPM, setIsJBPM] = useState(false);
    const [isAuth, setIsAuth] = useState(false);
    const [isPages, setIsPages] = useState(false);
    const [isBaseUi, setIsBaseUi] = useState(false);
    const [isAdvanceUi, setIsAdvanceUi] = useState(false);
    const [isForms, setIsForms] = useState(false);
    const [isTables, setIsTables] = useState(false);
    const [isCharts, setIsCharts] = useState(false);
    const [isIcons, setIsIcons] = useState(false);
    const [isMaps, setIsMaps] = useState(false);
    const [isMultiLevel, setIsMultiLevel] = useState(false);
    const [Ar, SetAr] = useState([]);

    const [iscurrentState, setIscurrentState] = useState('Dashboard');
    // ======================================Start Auto LogOut========================

    // const [isLoggedIn, setLoggedIn] = useState(true);

    // useEffect(() => {
    //     let timeoutId;

    //     const resetTimeout = () => {
    //         clearTimeout(timeoutId);
    //         startTimeout();
    //     };

    //     const startTimeout = () => {
    //         const currentUrl = window.location.href;
    //         //console.log('Current URL:', currentUrl);
    //         if(currentUrl.includes("plant360")){
    //             console.log('Auto Log Off Disabled.!!');
    //         }
    //         else{
    //             timeoutId = setTimeout(() => {
    //                 // Logout logic here
    //                 setLoggedIn(false);
    //                 history('/logout');
    //                 console.log('User has been inactive for 10 minutes.');
    //             }, 3600000); // 1 hrs in milliseconds
    //         }
            
            
    //     };


    //     const handleActivity = () => {
    //         const currentUrl = window.location.href;
    //         //console.log('Current URL:', currentUrl);
    //         resetTimeout();
    //     };

    //     // Attach event listeners to detect user activity
    //     document.addEventListener('mousemove', handleActivity);
    //     document.addEventListener('keydown', handleActivity);

    //     // Start the initial timeout
    //     startTimeout();

    //     // Cleanup event listeners on component unmount
    //     return () => {
    //         clearTimeout(timeoutId);
    //         document.removeEventListener('mousemove', handleActivity);
    //         document.removeEventListener('keydown', handleActivity);
    //     };
    // }, [isLoggedIn]);

    // ======================================End Auto LogOut========================

    function updateIconSidebar(e) {
        if (e && e.target && e.target.getAttribute("subitems")) {
            const ul = document.getElementById("two-column-menu");
            const iconItems = ul.querySelectorAll(".nav-icon.active");
            let activeIconItems = [...iconItems];
            activeIconItems.forEach((item) => {
                item.classList.remove("active");
                var id = item.getAttribute("subitems");
                if (document.getElementById(id))
                    document.getElementById(id).classList.remove("show");
            });
        }
    }

    useEffect(() => {


        const main_menu = sessionStorage.getItem("main_menu_login");
        const obj = JSON.parse(main_menu);

        let result = {};

        obj.menuItems.forEach(function (item) {
            if (result[item.mainMenu]) {
                result[item.mainMenu].push({
                    sub_menu: item.subMenuMaster
                });
            } else {
                result[item.mainMenu] = [{
                    sub_menu: item.subMenuMaster
                }];
            }
        });


        let finalResult1 = [];


        console.log(result);

        for (let key in result) {

            finalResult1.push({
                main_menu: key,
                values: result[key]
            });

        }

        console.log("final", finalResult1);
        const finalResult2 = [];
        for (let key1 in finalResult1) {

            console.log(finalResult1[key1]);
            let finalResult = [];
            for (let key2 in finalResult1[key1].values) {
                console.log(finalResult1[key1].values[key2].sub_menu);
                if (finalResult1[key1].values[key2].sub_menu !== null) {
                    const pl = {};
                    pl["id"] = finalResult1[key1].values[key2].sub_menu.companyCode;
                    pl["label"] = finalResult1[key1].values[key2].sub_menu.name;
                    pl["link"] = finalResult1[key1].values[key2].sub_menu.url;
                    pl["parentId"] = finalResult1[key1].main_menu;
                    finalResult.push(pl);
                }
            }

            const menuIcons = {
                Master: "ri-tools-line",
                Dashboard: "ri-dashboard-2-line",
                Reports: "ri-file-chart-line",
                Sequencing: "ri-flow-chart-line",
                Configuration: "ri-settings-3-line",
                Live: "ri-live-line",
            };
            
            finalResult2.push({
                id: finalResult1[key1].main_menu,
                label: finalResult1[key1].main_menu,
                icon: menuIcons[finalResult1[key1].main_menu] || "ri-dashboard-2-line", // Fallback icon
                link: "/",
                stateVariables: 
                    finalResult1[key1].main_menu === "Master" ? isMaster : 
                    finalResult1[key1].main_menu === "Dashboard" ? isDashboard : 
                    finalResult1[key1].main_menu === "Sequencing" ? isSequencing : 
                    finalResult1[key1].main_menu === "Configuration" ? isConfiguration : 
                    finalResult1[key1].main_menu === "Live" ? isLive : 
                    isReport,
                click: function (e) {
                    e.preventDefault();
                    switch (finalResult1[key1].main_menu) {
                        case "Master":
                            setIsMaster(!isMaster);
                            break;
                        case "Dashboard":
                            setIsDashboard(!isDashboard);
                            break;
                        case "Reports":
                            setIsReport(!isReport);
                            break;
                        case "Sequencing":
                            setIsSequencing(!isSequencing);
                            break;
                        case "Configuration":
                            setIsConfiguration(!isConfiguration);
                            break;
                        case "Live":
                            setIsLive(!isLive);
                            break;
                        default:
                            break;
                    }
                    setIscurrentState(finalResult1[key1].main_menu);
                    updateIconSidebar(e);
                },
                subItems: finalResult,
            });
            
            // alert(isMaster)
            SetAr(finalResult2);
        }




        // sessionStorage.getItem("authUser");


        document.body.classList.remove('twocolumn-panel');
        if (iscurrentState !== 'Dashboard') {
            setIsDashboard(false);
        }
        if (iscurrentState !== 'Apps') {
            setIsApps(false);
        }
        if (iscurrentState !== 'Master') {
            setIsMaster(false);
        }
        if (iscurrentState !== 'Reports') {
            setIsReport(false);
        }
        if (iscurrentState !== 'Sequencing') {
            setIsSequencing(false);
        }
        if (iscurrentState !== 'Configuration') {
            setIsConfiguration(false);
        }
        if (iscurrentState !== 'Live') {
            setIsLive(false);
        }
        if (iscurrentState !== 'Auth') {
            setIsAuth(false);
        }
        if (iscurrentState !== 'Pages') {
            setIsPages(false);
        }
        if (iscurrentState !== 'BaseUi') {
            setIsBaseUi(false);
        }
        if (iscurrentState !== 'AdvanceUi') {
            setIsAdvanceUi(false);
        }
        if (iscurrentState !== 'Forms') {
            setIsForms(false);
        }
        if (iscurrentState !== 'Tables') {
            setIsTables(false);
        }
        if (iscurrentState !== 'Charts') {
            setIsCharts(false);
        }
        if (iscurrentState !== 'Icons') {
            setIsIcons(false);
        }
        if (iscurrentState !== 'Maps') {
            setIsMaps(false);
        }
        if (iscurrentState !== 'MuliLevel') {
            setIsMultiLevel(false);
        }
        if (iscurrentState === 'Widgets') {
            history("/widgets");
            document.body.classList.add('twocolumn-panel');
        }
    }, [
        history,
        iscurrentState,
        isDashboard,
        isApps,
        isMaster,
        isReport,
        isSequencing,
        isConfiguration,
        isLive,
        isAuth,
        isPages,
        isBaseUi,
        isAdvanceUi,
        isForms,
        isTables,
        isCharts,
        isIcons,
        isMaps,
        isMultiLevel
    ]);

    const menuItems = Ar;
    /* const menuItems = [
         {
             label: "Menu",
             isHeader: true,
         },
         {
             id: "dashboard",
             label: "Dashboards",
             icon: "ri-dashboard-2-line",
             link: "/",
             stateVariables: isDashboard,
             click: function (e) {
                 e.preventDefault();
                 setIsDashboard(!isDashboard);
                 setIscurrentState('Dashboard');
                 updateIconSidebar(e);
             },
             subItems: [
                 {
                     id: "dashboard-seq",
                     label: "Sequence Dashbaord",
                     link: "/charts-echarts",
                     parentId: "dashboard",
                 },
                 {
                     id: "dashboard-gate",
                     label: "Gate In Dashboard",
                     //link: "/charts-chartjs",
                   //  link: '/apps-job-details',
                     link : "/apps-job-companies-lists",
                     parentId: "dashboard",
                 },{
                     id: "dashboard-gate",
                     label: "Gate Out Dashboard",
                     
                    // link: "/charts-chartjs",
                     link: "/apps-tasks-list-view",
                     parentId: "dashboard",
                 },
             ],
         },
         {
             id: "apps",
             label: "Master",
             icon: "ri-apps-2-line",
             link: "/#",
             click: function (e) {
                 e.preventDefault();
                 setIsApps(!isApps);
                 setIscurrentState('Apps');
                 updateIconSidebar(e);
             },
             stateVariables: isApps,
             subItems: [
                 {
                     id: "customer",
                     label: "Customer Master",
                     link: "/customer-master",
                     parentId: "apps",
                 },
                 {
                     id: "device",
                     label: "Device Master",
                     link: "/device",
                     parentId: "apps",
                 },
                 {
                     id: "deviceType",
                     label: "Device Type Master",
                     link: "/deviceType",
                     parentId: "apps",
                 },
                 {
                     id: "department",
                     label: "Department Master",
                     link: "/department",
                     parentId: "apps",
                 },
                 {
                     id: "cluster",
                     label: "Cluster Master",
                     link: "/cluster",
                     parentId: "apps",
                 },
                 {
                     id: "company",
                     label: "Company Master",
                     link: "/company",
                     parentId: "apps",
                 },
                 {
                     id: "commomConstant",
                     label: "Common Constants Master",
                     link: "/commonConstant",
                     parentId: "apps",
                 },
                 {
                     id: "commomShift",
                     label: "Common Shift Master",
                     link: "/commomShift",
                     parentId: "apps",
                 },
                 {
                     id: "material",
                     label: "Material Master",
                     link: "/material",
                     parentId: "apps",
                 },
                 {
                     id: "material-types",
                     label: "Material Type Master",
                     link: "/material-types",
                     parentId: "apps",
                 },
                 {
                     id: "driver-masters",
                     label: "Driver Master",
                     link: "/driver",
                     parentId: "apps",
                 },
                 {
                     id: "roles-master",
                     label: "Role Master",
                     link: "/roles",
                     parentId: "apps",
                 },
                 {
                     id: "plants-master",
                     label: "Plant Master",
                     link: "/plants",
                     parentId: "apps",
                 },
                 {
                     id: "main-menu",
                     label: "Main Menu Master",
                     link: "/main-menu",
                     parentId: "apps",
                 },
                 {
                     id: "sub-menu",
                     label: "Sub Menu Master",
                     link: "/sub-menu",
                     parentId: "apps",
                 },
                 {
                     id: "movements",
                     label: "Movement Master",
                     link: "/movements",
                     parentId: "apps",
                 },
                 // {
                 //     id: "transporterMaster",
                 //     label: "Transporter Master",
                 //     link: "/transporter-master",
                 //     parentId: "apps",
                 // },
                 {
                     id: "vehicle",
                     label: "Vehicle Master",
                     link: "/vehicle",
                     parentId: "apps",
                 },                
                 {
                     id: "stage",
                     label: "Stage Master",
                     link: "/stage",
                     parentId: "apps",
                 },
                 {
                     id: "vehicleMap",
                     label: "Vehicle Tag Mapping",
                     link: "/vehicle-tag-mapping",
                     parentId: "apps",
                 },
                 {
                     id: "module",
                     label: "Module Master",
                     link: "/module-master",
                     parentId: "apps",
                 },
                 {
                     id: "plan",
                     label: "Plan Master",
                     link: "/plan-master",
                     parentId: "apps",
                 },
                 {
                     id: "interface",
                     label: "Interface Master",
                     link: "/interface",
                     parentId: "apps",
                 },                
                 {
                     id: "documentTypeMaster",
                     label: "Document Type Master",
                     link: "/document-type-mastrer",
                     parentId: "apps",
                 },
                 {
                     id: "stageLocation",
                     label: "Stage Location Master",
                     link: "/stage-location",
                     parentId: "apps",
                 },
                 {
                     id: "users",
                     label: "User Master",
                     link: "/users",
                     parentId: "apps",
                 },
             ],
         },{
             id: "reports",
             label: "Reports",
             icon: "ri-apps-2-line",
             link: "/#",
             click: function (e) {
                 e.preventDefault();
                 setIsReport(!isReport);
                 setIscurrentState('Report');
                 updateIconSidebar(e);
             },
             stateVariables: isReport,
             subItems: [
                 {
                     id: "csr",
                     label: "CSR Report",
                     link: "/report-csr",
                     parentId: "reports",
                 },
                 {
                     id: "pmr",
                     label: "PMR Report",
                     link: "/report-pmr",
                     parentId: "reports",
                 },
                 {
                     id: "tag-mapping",
                     label: "TAG Mapping",
                     link: "/tagMapping",
                     parentId: "reports",
                 },
                 {
                     id: "tolerance",
                     label: "Tolerance Report",
                     link: "/tolerance",
                     parentId: "reports",
                 },
                 {
                     id: "weight-approve",
                     label: "Weight Approve",
                     link: "/weight-approve",
                     parentId: "reports",
                 },
             ],
         },
         
    ];*/
    return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;