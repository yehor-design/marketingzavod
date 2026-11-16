___TERMS_OF_SERVICE___

By creating or modifying this file you agree to Google Tag Manager's Community
Template Gallery Developer Terms of Service available at
https://developers.google.com/tag-manager/gallery-tos (or such other URL as
Google may provide), as modified from time to time.


___INFO___

{
  "displayName": "Cookiebot CMP",
  "description": "Cookiebot is a Consent Management Platform (CMP) that helps make your use of cookies and online tracking compliant with data protection legislations like GDPR and CCPA. More on https://cookiebot.com.",
  "categories": [
    "TAG_MANAGEMENT",
    "PERSONALIZATION"
  ],
  "securityGroups": [],
  "id": "cookiebot",
  "type": "TAG",
  "version": 1,
  "brand": {
    "thumbnail": "",
    "displayName": "Cookiebot",
    "id": "Cookiebot"
  },
  "containerContexts": [
    "WEB"
  ]
}


___TEMPLATE_PARAMETERS___

[
  {
    "notSetText": "Please enter the \u0027Domain Group ID\u0027 found under the tab named \u0027Your Scripts\u0027 in Cookiebot in the format \u0027XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX\u0027",
    "help": "Create an account on Cookiebot.com and copy \u0027Domain Group ID\u0027 from the tab \u0027Your Scripts\u0027 in Cookiebot.",
    "valueValidators": [
      {
        "args": [
          "^(\\{){0,1}[0-9a-fA-F]{8}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{12}(\\}){0,1}$"
        ],
        "type": "REGEX"
      },
      {
        "type": "NON_EMPTY"
      }
    ],
    "displayName": "Cookiebot ID",
    "simpleValueType": true,
    "name": "serial",
    "type": "TEXT",
    "valueHint": "Your Cookiebot Domain Group ID"
  },
  {
    "help": "Select how Cookiebot determines the language of the consent banner.",
    "selectItems": [
      {
        "displayValue": "Default (auto-detect)",
        "value": "auto"
      },
      {
        "displayValue": "By GTM variable",
        "value": "variable"
      }
    ],
    "displayName": "Language",
    "simpleValueType": true,
    "name": "language",
    "type": "SELECT"
  },
  {
    "type": "SELECT",
    "name": "cdnRegion",
    "displayName": "CDN Region",
    "macrosInSelect": false,
    "selectItems": [
      {
        "value": "com",
        "displayValue": ".com"
      },
      {
        "value": "eu",
        "displayValue": ".eu"
      }
    ],
    "simpleValueType": true,
    "help": "Select which CDN region Cookiebot uses",
    "defaultValue": "com"
  },
  {
    "help": "Select a variable that returns a two-letter ISO 639-1 language code, e.g. from current URL. In Cookiebot, create matching content versions for all languages supported on your site.",
    "enablingConditions": [
      {
        "paramName": "language",
        "type": "EQUALS",
        "paramValue": "variable"
      }
    ],
    "valueValidators": [
      {
        "type": "NON_EMPTY"
      }
    ],
    "displayName": "Language Variable",
    "simpleValueType": true,
    "name": "languageVariable",
    "type": "TEXT"
  },
  {
    "type": "CHECKBOX",
    "name": "addGeoRegion",
    "checkboxText": "Add Geo Region(s)",
    "simpleValueType": true,
    "help": "Add regions where a different banner than the default should be displayed."
  },
  {
    "type": "GROUP",
    "name": "Geo Region",
    "displayName": "Geo Regions",
    "groupStyle": "NO_ZIPPY",
    "subParams": [
      {
        "type": "SIMPLE_TABLE",
        "name": "geoRegions",
        "simpleTableColumns": [
          {
            "defaultValue": "",
            "displayName": "Region",
            "name": "altRegion",
            "type": "TEXT",
            "valueValidators": [
              {
                "type": "REGEX",
                "args": [
                  "^([a-zA-Z]{2}(-[0-9]{2})?(, ?)?)+$"
                ],
                "errorMessage": "Must be a region ISO code, for example: \"us-06\" or \"gb\""
              }
            ],
            "valueHint": "DE, DK, AT, US-06"
          },
          {
            "defaultValue": "",
            "displayName": "Domain Group ID",
            "name": "altCbid",
            "type": "TEXT",
            "valueValidators": [
              {
                "type": "REGEX",
                "args": [
                  "^[\\dA-Fa-f]{8}(-[\\dA-Fa-f]{4}){3}-[\\dA-Fa-f]{12}$"
                ],
                "errorMessage": "Must resemble \"01234567-89ab-cdef-0123-456789abcdef\""
              }
            ],
            "valueHint": "Your Cookiebot Domain Group ID"
          }
        ]
      }
    ],
    "enablingConditions": [
      {
        "paramName": "addGeoRegion",
        "paramValue": true,
        "type": "EQUALS"
      }
    ]
  },
  {
    "type": "CHECKBOX",
    "name": "consentModeEnabled",
    "checkboxText": "Enable Google Consent Mode",
    "simpleValueType": true,
    "defaultValue": true,
    "help": "Enable Consent Mode if one or more of your tags rely on Google\u0027s consent API. Cookiebot will then automatically signal the user\u0027s consent to these tags.",
    "alwaysInSummary": true
  },
  {
    "type": "CHECKBOX",
    "name": "iabFramework",
    "checkboxText": "Enable IAB Transparency and Consent Framework",
    "simpleValueType": true,
    "help": "Enable IAB Europe\u0027s Transparency \u0026 Consent Framework if your site is displaying ads from one or more IAB Vendors."
  },
  {
    "type": "GROUP",
    "name": "ConsentModeSettings",
    "displayName": "Consent Mode Settings",
    "groupStyle": "NO_ZIPPY",
    "subParams": [
      {
        "type": "TEXT",
        "name": "waitForUpdate",
        "displayName": "Wait for update",
        "simpleValueType": true,
        "valueUnit": "miliseconds",
        "help": "Set how many miliseconds to wait before firing tags waiting for consent",
        "defaultValue": 2000,
        "valueValidators": [
          {
            "type": "NON_EMPTY"
          },
          {
            "type": "NON_NEGATIVE_NUMBER"
          }
        ]
      },
      {
        "type": "SELECT",
        "name": "adsDataRedaction",
        "displayName": "Redact ads data",
        "selectItems": [
          {
            "value": true,
            "displayValue": "True"
          },
          {
            "value": false,
            "displayValue": "False"
          },
          {
            "value": "dynamic",
            "displayValue": "Dynamic (match ad_storage)"
          }
        ],
        "simpleValueType": true,
        "defaultValue": "dynamic",
        "help": "When ad data redaction is true and marketing cookies are denied, ad click identifiers sent in network requests by Google Ads and Floodlight tags will be redacted. Network requests will also be sent through a cookieless domain"
      },
      {
        "type": "CHECKBOX",
        "name": "urlPassthrough",
        "checkboxText": "Enable URL passthrough",
        "simpleValueType": true,
        "help": "When using URL passthrough, a few query parameters may be appended to links as users navigate through pages on your website"
      },
      {
        "type": "CHECKBOX",
        "name": "advertiserConsentModeEnabled",
        "checkboxText": "Advertiser Consent Mode",
        "simpleValueType": true,
        "help": "If enabled, Google will deduce ad_storage, ad_user_data and ad_personalization data from the TC string.",
        "defaultValue": true,
        "enablingConditions": [
          {
            "paramName": "consentModeEnabled",
            "paramValue": true,
            "type": "EQUALS"
          }
        ]
      },
      {
        "type": "GROUP",
        "name": "DefaultConsent",
        "displayName": "Default Consent State",
        "subParams": [
          {
            "type": "PARAM_TABLE",
            "name": "regionSettings",
            "paramTableColumns": [
              {
                "param": {
                  "type": "TEXT",
                  "name": "region",
                  "displayName": "Region (leave blank to apply globally)",
                  "simpleValueType": true
                },
                "isUnique": true
              },
              {
                "param": {
                  "type": "SELECT",
                  "name": "defaultConsentPreferences",
                  "displayName": "Preferences (functionality_storage and personalization_storage)",
                  "selectItems": [
                    {
                      "value": "denied",
                      "displayValue": "Denied"
                    },
                    {
                      "value": "granted",
                      "displayValue": "Granted"
                    }
                  ],
                  "simpleValueType": true,
                  "help": "Select default consent state for preference cookies",
                  "defaultValue": "denied"
                },
                "isUnique": false
              },
              {
                "param": {
                  "type": "SELECT",
                  "name": "defaultConsentStatistics",
                  "displayName": "Statistics (analytics_storage)",
                  "selectItems": [
                    {
                      "value": "denied",
                      "displayValue": "Denied"
                    },
                    {
                      "value": "granted",
                      "displayValue": "Granted"
                    }
                  ],
                  "simpleValueType": true,
                  "defaultValue": "denied",
                  "help": "Select default consent state for statistics cookies"
                },
                "isUnique": false
              },
              {
                "param": {
                  "type": "SELECT",
                  "name": "defaultConsentMarketing",
                  "displayName": "Marketing (ad_storage)",
                  "selectItems": [
                    {
                      "value": "denied",
                      "displayValue": "Denied"
                    },
                    {
                      "value": "granted",
                      "displayValue": "Granted"
                    }
                  ],
                  "simpleValueType": true,
                  "defaultValue": "denied",
                  "help": "Select default consent state for marketing cookies"
                },
                "isUnique": false
              },
              {
                "param": {
                  "type": "SELECT",
                  "name": "defaultConsentMarketingAdUserData",
                  "displayName": "Marketing (ad_user_data)",
                  "selectItems": [
                    {
                      "value": "denied",
                      "displayValue": "Denied"
                    },
                    {
                      "value": "granted",
                      "displayValue": "Granted"
                    }
                  ],
                  "simpleValueType": true,
                  "help": "Select default consent state for marketing cookies",
                  "defaultValue": "denied"
                },
                "isUnique": false
              },
              {
                "param": {
                  "type": "SELECT",
                  "name": "defaultConsentMarketingAdPersonalization",
                  "displayName": "Marketing (ad_personalization)",
                  "selectItems": [
                    {
                      "value": "denied",
                      "displayValue": "Denied"
                    },
                    {
                      "value": "granted",
                      "displayValue": "Granted"
                    }
                  ],
                  "simpleValueType": true,
                  "help": "Select default consent state for marketing cookies",
                  "defaultValue": "denied"
                },
                "isUnique": false
              }
            ],
            "editRowTitle": "Edit region",
            "newRowButtonText": "Add region",
            "newRowTitle": "Add region"
          }
        ],
        "help": "A default consent state of \u0027denied\u0027 will apply until the user has submitted a consent. You can add different default states for users in different geographical regions. Please use ISO-3166-1 alpha-2 country codes for region values."
      }
    ],
    "enablingConditions": [
      {
        "paramName": "consentModeEnabled",
        "paramValue": true,
        "type": "EQUALS"
      }
    ]
  }
]


___SANDBOXED_JS_FOR_WEB_TEMPLATE___

const injectScript = require('injectScript');
const encodeUriComponent = require('encodeUriComponent');
const queryPermission = require('queryPermission');
const gtagSet = require('gtagSet');
const setDefaultConsentState = require('setDefaultConsentState');
const getCookieValues = require('getCookieValues');
const updateConsentState = require('updateConsentState');
const cookiebotSerial = data.serial;
const IABEnabled = data.iabFramework;
const consentModeEnabled = data.consentModeEnabled;
const language = data.language;
const waitForUpdate = data.waitForUpdate;
const urlPassthrough = data.urlPassthrough;
const adsDataRedaction = data.adsDataRedaction || 'dynamic';
const regionSettings = data.regionSettings || [];
const geoRegions = data.geoRegions || [];
const cdnRegion = data.cdnRegion || 'com';
let hasDefaultState = false;
let advertiserConsentModeEnabled = data.advertiserConsentModeEnabled;

// Fallback: existing templates that receives new fields might default to "undefined", even though a default value is set
if (consentModeEnabled && advertiserConsentModeEnabled === undefined) {
  advertiserConsentModeEnabled = true; // set to true (default) if checkbox is shown and has undefined value
}

// Adding alternate banners for specified georegions
let geoRegionsString = "";
geoRegions.forEach(regionObj => {
  if (geoRegionsString != "") {
    geoRegionsString += ",";
  }
  
  geoRegionsString += "{'region':'" + regionObj.altRegion + "','cbid':'" + regionObj.altCbid + "'}";
});

if (consentModeEnabled !== false) {
  
    // Turn region string ("DK, NL, DE") into array (["DK", "NL", "DE"])
    const getRegionArr = (regionStr) => {
        return regionStr.split(',')
            .map(region => region.trim())
            .filter(region => region.length !== 0);
    };

    // Get default consent state per region
    const getConsentRegionData = (regionObject) => {
        const consentRegionData = {
            ad_storage: regionObject.defaultConsentMarketing,
            ad_user_data: regionObject.defaultConsentMarketingAdUserData,
            ad_personalization: regionObject.defaultConsentMarketingAdPersonalization,
            analytics_storage: regionObject.defaultConsentStatistics,
            functionality_storage: regionObject.defaultConsentPreferences,
            personalization_storage: regionObject.defaultConsentPreferences,
            security_storage: 'granted'
        };
      
        const regionArr = getRegionArr(regionObject.region);
      
        if (regionArr.length) {
          consentRegionData.region = regionArr;
        }
        
        return consentRegionData;
    };
  
    // Set url_passthrough and developer ID
    gtagSet({
      'url_passthrough': urlPassthrough === true,
      'developer_id.dMWZhNz': true
    });

    // Set default consent for each region
    regionSettings.forEach(regionObj => {
        const consentRegionData = getConsentRegionData(regionObj);

        if (waitForUpdate > 0) {
            consentRegionData.wait_for_update = waitForUpdate;
        }

        setDefaultConsentState(consentRegionData);
      
        if (regionObj.region === undefined || regionObj.region.trim() === '')
        {
          hasDefaultState = true;
        }
    });
  
    // Fallback to opt-out if no global default consent state has been defined in region settings
    if(!hasDefaultState) {
      setDefaultConsentState({
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied',
        functionality_storage: 'denied',
        personalization_storage: 'denied',
        security_storage: 'granted'
      });
    }

    // Read existing consent from consent cookie if it exists
    let consentObj = null;
    
    if (getCookieValues("CookieConsent").toString() !== '') {
        const consentString = getCookieValues("CookieConsent")[0];

        if ((typeof consentString !== 'undefined') && (consentString.indexOf("{") === 0) && (consentString.indexOf("}") > 0)) {
            // Turn consentString into object
            consentObj = {
                preferences: 'denied',
                statistics: 'denied',
                marketing: 'denied',
                readConsentString: function (str) {
                    let tempA = str.replace('{', '').replace('}', '').split(","),
                        tempB = {};
                    for (let i = 0; i < tempA.length; i += 1) {
                        let tempC = tempA[i].split(':');
                        tempB[tempC[0]] = tempC[1];
                    }

                    consentObj.preferences = tempB.preferences === 'true' ? 'granted' : 'denied';
                    consentObj.statistics = tempB.statistics === 'true' ? 'granted' : 'denied';
                    consentObj.marketing = tempB.marketing === 'true' ? 'granted' : 'denied';
                    consentObj.region = tempB.region; // This is the region wherefrom the consent was originally submitted
                }
            };

            consentObj.readConsentString(consentString);

            updateConsentState({
                'ad_storage': consentObj.marketing,
                'ad_user_data': consentObj.marketing,
                'ad_personalization': consentObj.marketing,
                'analytics_storage': consentObj.statistics,
                'functionality_storage': consentObj.preferences,
                'personalization_storage': consentObj.preferences,
                'security_storage': 'granted'
            });
        }
    }
    
    // Set data redaction
    const marketingConsent = consentObj ? consentObj.marketing : 'denied';
    const marketingConsentBoolean = marketingConsent === 'granted';
    const adsDataRedactionValue = adsDataRedaction === 'dynamic' ? !marketingConsentBoolean : adsDataRedaction === 'true';
    
    gtagSet({
      'ads_data_redaction': adsDataRedactionValue
    });
}

let scriptUrl = 'https://consent.cookiebot.' + cdnRegion + '/uc.js?cbid=' + encodeUriComponent(cookiebotSerial) + '&implementation=gtm';

if(consentModeEnabled === false)
{
  scriptUrl += '&consentmode=disabled';
}
if (consentModeEnabled === false || advertiserConsentModeEnabled === false) {
  scriptUrl += '&advertiserConsentMode=disabled';
}
else
{
  scriptUrl += '&consentmode-dataredaction=' + adsDataRedaction;
}

if (language === 'variable')
{
  scriptUrl += '&culture=' + encodeUriComponent(data.languageVariable);
}

// Add georegions to the script src
if (geoRegionsString != "") {
  scriptUrl += '&georegions=' + encodeUriComponent(geoRegionsString); 
}

if(IABEnabled) {
  scriptUrl += '&framework=TCFv2.2';
}

if (queryPermission('inject_script', scriptUrl)) {
  injectScript(scriptUrl, data.gtmOnSuccess, data.gtmOnFailure);
} else {
  data.gtmOnFailure();
}


___WEB_PERMISSIONS___

[
  {
    "instance": {
      "key": {
        "publicId": "inject_script",
        "versionId": "1"
      },
      "param": [
        {
          "key": "urls",
          "value": {
            "type": 2,
            "listItem": [
              {
                "type": 1,
                "string": "https://*.cookiebot.com/"
              },
              {
                "type": 1,
                "string": "https://*.cookiebot.eu/"
              }
            ]
          }
        }
      ]
    },
    "clientAnnotations": {
      "isEditedByUser": true
    },
    "isRequired": true
  },
  {
    "instance": {
      "key": {
        "publicId": "access_consent",
        "versionId": "1"
      },
      "param": [
        {
          "key": "consentTypes",
          "value": {
            "type": 2,
            "listItem": [
              {
                "type": 3,
                "mapKey": [
                  {
                    "type": 1,
                    "string": "consentType"
                  },
                  {
                    "type": 1,
                    "string": "read"
                  },
                  {
                    "type": 1,
                    "string": "write"
                  }
                ],
                "mapValue": [
                  {
                    "type": 1,
                    "string": "analytics_storage"
                  },
                  {
                    "type": 8,
                    "boolean": false
                  },
                  {
                    "type": 8,
                    "boolean": true
                  }
                ]
              },
              {
                "type": 3,
                "mapKey": [
                  {
                    "type": 1,
                    "string": "consentType"
                  },
                  {
                    "type": 1,
                    "string": "read"
                  },
                  {
                    "type": 1,
                    "string": "write"
                  }
                ],
                "mapValue": [
                  {
                    "type": 1,
                    "string": "ad_storage"
                  },
                  {
                    "type": 8,
                    "boolean": false
                  },
                  {
                    "type": 8,
                    "boolean": true
                  }
                ]
              },
              {
                "type": 3,
                "mapKey": [
                  {
                    "type": 1,
                    "string": "consentType"
                  },
                  {
                    "type": 1,
                    "string": "read"
                  },
                  {
                    "type": 1,
                    "string": "write"
                  }
                ],
                "mapValue": [
                  {
                    "type": 1,
                    "string": "functionality_storage"
                  },
                  {
                    "type": 8,
                    "boolean": false
                  },
                  {
                    "type": 8,
                    "boolean": true
                  }
                ]
              },
              {
                "type": 3,
                "mapKey": [
                  {
                    "type": 1,
                    "string": "consentType"
                  },
                  {
                    "type": 1,
                    "string": "read"
                  },
                  {
                    "type": 1,
                    "string": "write"
                  }
                ],
                "mapValue": [
                  {
                    "type": 1,
                    "string": "personalization_storage"
                  },
                  {
                    "type": 8,
                    "boolean": false
                  },
                  {
                    "type": 8,
                    "boolean": true
                  }
                ]
              },
              {
                "type": 3,
                "mapKey": [
                  {
                    "type": 1,
                    "string": "consentType"
                  },
                  {
                    "type": 1,
                    "string": "read"
                  },
                  {
                    "type": 1,
                    "string": "write"
                  }
                ],
                "mapValue": [
                  {
                    "type": 1,
                    "string": "security_storage"
                  },
                  {
                    "type": 8,
                    "boolean": false
                  },
                  {
                    "type": 8,
                    "boolean": true
                  }
                ]
              },
              {
                "type": 3,
                "mapKey": [
                  {
                    "type": 1,
                    "string": "consentType"
                  },
                  {
                    "type": 1,
                    "string": "read"
                  },
                  {
                    "type": 1,
                    "string": "write"
                  }
                ],
                "mapValue": [
                  {
                    "type": 1,
                    "string": "wait_for_update"
                  },
                  {
                    "type": 8,
                    "boolean": false
                  },
                  {
                    "type": 8,
                    "boolean": true
                  }
                ]
              },
              {
                "type": 3,
                "mapKey": [
                  {
                    "type": 1,
                    "string": "consentType"
                  },
                  {
                    "type": 1,
                    "string": "read"
                  },
                  {
                    "type": 1,
                    "string": "write"
                  }
                ],
                "mapValue": [
                  {
                    "type": 1,
                    "string": "ad_personalization"
                  },
                  {
                    "type": 8,
                    "boolean": false
                  },
                  {
                    "type": 8,
                    "boolean": true
                  }
                ]
              },
              {
                "type": 3,
                "mapKey": [
                  {
                    "type": 1,
                    "string": "consentType"
                  },
                  {
                    "type": 1,
                    "string": "read"
                  },
                  {
                    "type": 1,
                    "string": "write"
                  }
                ],
                "mapValue": [
                  {
                    "type": 1,
                    "string": "ad_user_data"
                  },
                  {
                    "type": 8,
                    "boolean": false
                  },
                  {
                    "type": 8,
                    "boolean": true
                  }
                ]
              }
            ]
          }
        }
      ]
    },
    "clientAnnotations": {
      "isEditedByUser": true
    },
    "isRequired": true
  },
  {
    "instance": {
      "key": {
        "publicId": "get_cookies",
        "versionId": "1"
      },
      "param": [
        {
          "key": "cookieAccess",
          "value": {
            "type": 1,
            "string": "specific"
          }
        },
        {
          "key": "cookieNames",
          "value": {
            "type": 2,
            "listItem": [
              {
                "type": 1,
                "string": "CookieConsent"
              }
            ]
          }
        }
      ]
    },
    "clientAnnotations": {
      "isEditedByUser": true
    },
    "isRequired": true
  },
  {
    "instance": {
      "key": {
        "publicId": "write_data_layer",
        "versionId": "1"
      },
      "param": [
        {
          "key": "keyPatterns",
          "value": {
            "type": 2,
            "listItem": [
              {
                "type": 1,
                "string": "ads_data_redaction"
              },
              {
                "type": 1,
                "string": "url_passthrough"
              },
              {
                "type": 1,
                "string": "developer_id.dMWZhNz"
              }
            ]
          }
        }
      ]
    },
    "clientAnnotations": {
      "isEditedByUser": true
    },
    "isRequired": true
  }
]


___TESTS___

scenarios: []


___NOTES___
Cookiebot CMP Tag v2.12.7
* (No template update, only meta-data): Update Cookiebot vendor details

Cookiebot CMP Tag v2.12.6
* (No template update, only meta-data): Update Cookiebot vendor details

Cookiebot CMP Tag v2.12.5
* (No template update, only meta-data): Update Cookiebot vendor details

Cookiebot CMP Tag v2.12.4
* (No template update, only meta-data): Update Cookiebot vendor details

Cookiebot CMP Tag v2.12.3
* (No template update, only meta-data): Update Cookiebot vendor details

Cookiebot CMP Tag v2.12.2
* (No template update, only meta-data): Update Cookiebot vendor details

Cookiebot CMP Tag v2.12.1
* (No template update, only meta-data): Update Cookiebot vendor details

Cookiebot CMP Tag v2.12
* (No template update, only meta-data): Update Cookiebot vendor details

Cookiebot CMP Tag v2.11
* (No template update, only meta-data): Add Cookiebot vendor details

Cookiebot CMP Tag v2.10
* Add option to disable Advertiser Consent Mode when GCM is enabled

Cookiebot CMP Tag v2.9
* Add option to use .eu CDN region

Cookiebot CMP Tag v2.8
* Add separate choices (dropdowns) for new Marketing bits

Cookiebot CMP Tag v2.7.1
* Add missing mention of new bits

Cookiebot CMP Tag v2.7
* Remove deprecated "TCFv2.0" dropdown option

Cookiebot CMP Tag v2.6
* Add support for ad_user_data and ad_personalization GCM signals

Cookiebot CMP Tag v2.5.1
* Resolved edge case issue where consentmode-dataredaction parameter is set as undefined

Cookiebot CMP Tag v2.5
* Added implementation URL-parameter

Cookiebot CMP Tag v2.4
* Added support for TCFv2.2

Cookiebot CMP Tag v2.3
* Added support for multi-legislation configurations

Cookiebot CMP Tag v2.2.2
* Added developer_id to template
* Resolved default consent issue when using an empty region value

Cookiebot CMP Tag v2.2.1
* Resolved ConsentModeEnabled default value issue

Cookiebot CMP Tag v2.2
* Added checkbox to enable / disable Google Consent Mode
* Added checkbox to enable / disable URL passthrough
* Added dropdown to control Ads Data Redaction
* Added "UpdateConsentState" support in the template code
* Changed Default Consent State to be region-based

Cookiebot CMP Tag v2.1
* Added support for wait_for_update flag

Cookiebot CMP Tag v2.0
* Implemented Google Consent Mode

Cookiebot CMP Tag v1.0
* Initial version
