/* Copyright IBM Corp. 2014 All Rights Reserved                      */

/* Module that provides a simple wrapper to cfenv. If running locally,
 * it will try to load env.json/env_custom.json from the working directory and 
 * pass that info along to cfenv. (If the JSON files are not present, it try to load  
 * env.log.) 
 */

var cfenv = require('cfenv');


var fs = require('fs-sync');
var properties = require ('properties-parser');

module.exports = (function() {
	var ENV_LOG_FILE = 'env.log';
	var ENV_JSON_FILE = 'env.json';
	var ENV_CUSTOM_JSON_FILE = 'env_custom.json';
	
	var appEnv;
	var envVars;

	// Short utility function to read in JSON
	// file.
	function getJSONFile(filename) {
		var parsedJSON;
		if (fs.exists(filename)) {
			parsedJSON = fs.readJSON(filename);
		}
		return parsedJSON;
	}
	
	// Short utility function to read env.log file out of
	// base working directory
	function getEnvLog() {
		return properties.read(ENV_LOG_FILE);
	}

	// Initialize based on whether running locally or in cloud.
	function init() {
		if (!process.env.VCAP_SERVICES) {
			// running locally
			
			// First try to load env.json
			if (fs.exists(ENV_JSON_FILE)) {
				try {
					var envJson = getJSONFile(ENV_JSON_FILE);
					
					if (fs.exists(ENV_CUSTOM_JSON_FILE)) {
						try {
							envVars = getJSONFile(ENV_CUSTOM_JSON_FILE);
						} catch (err) {
							// Some kind of problem reading the file or parsing the JSON
							console.error('Could not read configuration file ' + ENV_CUSTOM_JSON_FILE + ': ' + err);
						}
					}
					
					var envOptions = {
						// provide values for the VCAP_SERVICES value in
						// env.json
						vcap: {
							services: envJson.VCAP_SERVICES
						}
					};
					appEnv = cfenv.getAppEnv(envOptions);
				} catch (err) {
					// Some kind of problem reading the file or parsing the JSON
					console.error('Could not read configuration file ' + ENV_JSON_FILE + ': ' + err);
				}
			}
			
			if (!appEnv) {
				// If no luck getting env.json, then try env.log
				try {
					envVars = getEnvLog();
	
					var options = {
						// provide values for the VCAP_APPLICATION and VCAP_SERVICES environment
						// variables based on parsing values in the env.log file
						vcap: {
							application: JSON.parse(envVars.VCAP_APPLICATION),
							services: JSON.parse(envVars.VCAP_SERVICES)
						}
					};
					appEnv = cfenv.getAppEnv(options);
				} catch (err) {
					// Some kind of problem reading the file or parsing the JSON
					console.warn('Could not read configuration file: ' + err);
				}
			}
		}
		
		if (!appEnv) {
			// We're either running in the cloud or env.log could not be
			// loaded. So, just let cfenv process VCAP_SERVICES and 
			// VCAP_APPLICATION for us
			appEnv = cfenv.getAppEnv();
		}
	}
	init();
	
	/*
	 * Expose a getAppEnv function that returns a wrapped cfenv.
	 */
	return {
		getAppEnv: function() {
			if (appEnv) {
				return {
					app: appEnv.app,
					services: appEnv.services,
					isLocal: appEnv.isLocal,
					name: appEnv.name,
					port: appEnv.port,
					bind: appEnv.bind,
					urls: appEnv.urls,
					url: appEnv.url,
			
					getServices: function() {
						// pass-through to cfenv
						return appEnv.getServices();
					},
			
					getService: function(name) {
						// pass-through to cfenv
						return appEnv.getService(name);
					},
			
					getServiceURL: function(name, replacements) {
						// pass-through to cfenv
						return appEnv.getServiceURL(name, replacements);
					},
					
					getServiceCreds: function(spec) {
						// pass-through to cfenv
						return appEnv.getServiceCreds(spec);
					},
					
					/* Unlike the others, these functions don't wrapper
					 * cfenv function. If we're runnning locally, first try to
					 * get the value(s) from env.log data. Otherwise (or if 
					 * not found), look at process.env.
					 */
					getEnvVars: function() {
						var value;
						if (envVars) {
							value = envVars;
						}
						
						if (!value) {
							value = process.env;
						}
						
						return value;
					},
					
					getEnvVar: function(name) {
						var value;
						if (envVars) {
							value = envVars[name];
						}
						
						if (!value) {
							value = process.env[name];
						}
						
						return value;
					}
				};
			} else {
				// Problem getting the environment
				return null;
			}
		}
	};
}());