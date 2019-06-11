// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
	production: false,
  apiUrl: 'http://3.17.71.22', //aws ip address instead of url
  // apiUrl: 'http://report.test',
	//apiUrl: 'http://localhost/icentra/public',
	//apiUrl: 'http://localhost:8000',
	baseUrl: 'http://ec2-3-17-128-114.us-east-2.compute.amazonaws.com/',
	//baseUrl: 'http://localhost:8000/',
  api_prefix: 'v1',

  //Pusher notification and activity stream KEYS (please do not touch them until you know what you are doing)
  PUSHER_ID: '785146',
  PUSHER_KEY: '128353628e9c72df3de1',
  PUSHER_SECRET: '9a6e91ea1fc4ed9be6c5',
  PUSHER_CLUSTER: 'ap4',
  S3: 'https://s3.ap-southeast-2.amazonaws.com/icentra'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
