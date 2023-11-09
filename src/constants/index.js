import moment from 'moment-timezone';
import axios from 'axios';
export const GENDER_DROPDOWN_VALUES = ['male', 'female', 'other'];
export const DEFAULT_META_DESCRIPTION = 'Description goes here';
export const DEFAULT_META_KEYWORDS = 'keywords goes here';

// eslint-disable-next-line
export const REGEX_EMAIL =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// export const REGEX_PHONE_NUMBER = /^\+?[1-9]\d{8,20}$/;
export const REGEX_PHONE_NUMBER = /^\+(?:[0-9]?)[0-9]{8,14}$/;
export const REGEX_NAME = /^.{1,50}$/;
export const WHITESPACE_REGEX = /(.|\s)*\S(.|\s)*/;
// eslint-disable-next-line
export const SPECIAL_CHARACTERS = /^((?!([$#%])).)*$/;
// eslint-disable-next-line
export const PASSWORD_REGEX =
  /^(?=.*[a-z].*)(?=.*[A-Z].*)(?=.*\d.*)[a-zA-Z\d`~!@#$%^&*()_+-=\[\]\{\}\\\|\'\"\;\:\/\?\.\>\,\<]{6,}$/;

// export const URL_REGEX = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
// eslint-disable-next-line
export const URL_REGEX =
  /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

export const SOCIAL_LINKS = ['Custom', 'Facebook', 'Twitter', 'Instagram', 'YouTube', 'Twitch'];

export const DEFAULT_PROFILE_PICTURE = '/images/avatar.png';
export const DATE_FORMAT = 'YYYY-MM-DD';
export const MODAL_WIDTH = 630;

export const INT_REGEX = /^[0-9]*$/;
export const POSITIVE_INT_REGEX = /^[1-9][0-9]*$/;
export const FLOAT_REGEX = /^[+-]?([0-9]*[.])?[0-9]+$/;
export const POSITIVE_FLOAT_REGEX = /^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/;
export const ZIP_CODE_REGEX = /^\d{5}(?:[-\s]\d{4})?$/;
export const PRIMARY_COLOR_CODE = '#00375b';

export const TIME_DROPDOWN = [
  { value: '00:00:00', label: '12:00 AM' },
  { value: '00:15:00', label: '12:15 AM' },
  { value: '00:30:00', label: '12:30 AM' },
  { value: '00:45:00', label: '12:45 AM' },
  { value: '01:00:00', label: '01:00 AM' },
  { value: '01:15:00', label: '01:15 AM' },
  { value: '01:30:00', label: '01:30 AM' },
  { value: '01:45:00', label: '01:45 AM' },
  { value: '02:00:00', label: '02:00 AM' },
  { value: '02:15:00', label: '02:15 AM' },
  { value: '02:30:00', label: '02:30 AM' },
  { value: '02:45:00', label: '02:45 AM' },
  { value: '03:00:00', label: '03:00 AM' },
  { value: '03:15:00', label: '03:15 AM' },
  { value: '03:30:00', label: '03:30 AM' },
  { value: '03:45:00', label: '03:45 AM' },
  { value: '04:00:00', label: '04:00 AM' },
  { value: '04:15:00', label: '04:15 AM' },
  { value: '04:30:00', label: '04:30 AM' },
  { value: '04:45:00', label: '04:45 AM' },
  { value: '05:00:00', label: '05:00 AM' },
  { value: '05:15:00', label: '05:15 AM' },
  { value: '05:30:00', label: '05:30 AM' },
  { value: '05:45:00', label: '05:45 AM' },
  { value: '06:00:00', label: '06:00 AM' },
  { value: '06:15:00', label: '06:15 AM' },
  { value: '06:30:00', label: '06:30 AM' },
  { value: '06:45:00', label: '06:45 AM' },
  { value: '07:00:00', label: '07:00 AM' },
  { value: '07:15:00', label: '07:15 AM' },
  { value: '07:30:00', label: '07:30 AM' },
  { value: '07:45:00', label: '07:45 AM' },
  { value: '08:00:00', label: '08:00 AM' },
  { value: '08:15:00', label: '08:15 AM' },
  { value: '08:30:00', label: '08:30 AM' },
  { value: '08:45:00', label: '08:45 AM' },
  { value: '09:00:00', label: '09:00 AM' },
  { value: '09:15:00', label: '09:15 AM' },
  { value: '09:30:00', label: '09:30 AM' },
  { value: '09:45:00', label: '09:45 AM' },
  { value: '10:00:00', label: '10:00 AM' },
  { value: '10:15:00', label: '10:15 AM' },
  { value: '10:30:00', label: '10:30 AM' },
  { value: '10:45:00', label: '10:45 AM' },
  { value: '11:00:00', label: '11:00 AM' },
  { value: '11:15:00', label: '11:15 AM' },
  { value: '11:30:00', label: '11:30 AM' },
  { value: '11:45:00', label: '11:45 AM' },
  { value: '12:00:00', label: '12:00 PM' },
  { value: '12:15:00', label: '12:15 PM' },
  { value: '12:30:00', label: '12:30 PM' },
  { value: '12:45:00', label: '12:45 PM' },
  { value: '13:00:00', label: '01:00 PM' },
  { value: '13:15:00', label: '01:15 PM' },
  { value: '13:30:00', label: '01:30 PM' },
  { value: '13:45:00', label: '01:45 PM' },
  { value: '14:00:00', label: '02:00 PM' },
  { value: '14:15:00', label: '02:15 PM' },
  { value: '14:30:00', label: '02:30 PM' },
  { value: '14:45:00', label: '02:45 PM' },
  { value: '15:00:00', label: '03:00 PM' },
  { value: '15:15:00', label: '03:15 PM' },
  { value: '15:30:00', label: '03:30 PM' },
  { value: '15:45:00', label: '03:45 PM' },
  { value: '16:00:00', label: '04:00 PM' },
  { value: '16:15:00', label: '04:15 PM' },
  { value: '16:30:00', label: '04:30 PM' },
  { value: '16:45:00', label: '04:45 PM' },
  { value: '17:00:00', label: '05:00 PM' },
  { value: '17:15:00', label: '05:15 PM' },
  { value: '17:30:00', label: '05:30 PM' },
  { value: '17:45:00', label: '05:45 PM' },
  { value: '18:00:00', label: '06:00 PM' },
  { value: '18:15:00', label: '06:15 PM' },
  { value: '18:30:00', label: '06:30 PM' },
  { value: '18:45:00', label: '06:45 PM' },
  { value: '19:00:00', label: '07:00 PM' },
  { value: '19:15:00', label: '07:15 PM' },
  { value: '19:30:00', label: '07:30 PM' },
  { value: '19:45:00', label: '07:45 PM' },
  { value: '20:00:00', label: '08:00 PM' },
  { value: '20:15:00', label: '08:15 PM' },
  { value: '20:30:00', label: '08:30 PM' },
  { value: '20:45:00', label: '08:45 PM' },
  { value: '21:00:00', label: '09:00 PM' },
  { value: '21:15:00', label: '09:15 PM' },
  { value: '21:30:00', label: '09:30 PM' },
  { value: '21:45:00', label: '09:45 PM' },
  { value: '22:00:00', label: '10:00 PM' },
  { value: '22:15:00', label: '10:15 PM' },
  { value: '22:30:00', label: '10:30 PM' },
  { value: '22:45:00', label: '10:45 PM' },
  { value: '23:00:00', label: '11:00 PM' },
  { value: '23:15:00', label: '11:15 PM' },
  { value: '23:30:00', label: '11:30 PM' },
  { value: '23:45:00', label: '11:45 PM' },
];

export const COUNTRIES = [
  'Afghanistan',
  'Albania',
  'Algeria',
  'Andorra',
  'Angola',
  'Antigua & Deps',
  'Argentina',
  'Armenia',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bhutan',
  'Bolivia',
  'Bosnia Herzegovina',
  'Botswana',
  'Brazil',
  'Brunei',
  'Bulgaria',
  'Burkina',
  'Burundi',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Cape Verde',
  'Central African Rep',
  'Chad',
  'Chile',
  'China',
  'Colombia',
  'Comoros',
  'Congo',
  'Congo {Democratic Rep}',
  'Costa Rica',
  'Croatia',
  'Cuba',
  'Cyprus',
  'Czech Republic',
  'Denmark',
  'Djibouti',
  'Dominica',
  'Dominican Republic',
  'East Timor',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'Equatorial Guinea',
  'Eritrea',
  'Estonia',
  'Ethiopia',
  'Fiji',
  'Finland',
  'France',
  'Gabon',
  'Gambia',
  'Georgia',
  'Germany',
  'Ghana',
  'Greece',
  'Grenada',
  'Guatemala',
  'Guinea',
  'Guinea-Bissau',
  'Guyana',
  'Haiti',
  'Honduras',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland {Republic}',
  'Israel',
  'Italy',
  'Ivory Coast',
  'Jamaica',
  'Japan',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kiribati',
  'Korea North',
  'Korea South',
  'Kosovo',
  'Kuwait',
  'Kyrgyzstan',
  'Laos',
  'Latvia',
  'Lebanon',
  'Lesotho',
  'Liberia',
  'Libya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Macedonia',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Marshall Islands',
  'Mauritania',
  'Mauritius',
  'Mexico',
  'Micronesia',
  'Moldova',
  'Monaco',
  'Mongolia',
  'Montenegro',
  'Morocco',
  'Mozambique',
  'Myanmar',
  '{Burma}',
  'Namibia',
  'Nauru',
  'Nepal',
  'Netherlands',
  'New Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'Norway',
  'Oman',
  'Pakistan',
  'Palau',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Qatar',
  'Romania',
  'Russian Federation',
  'Rwanda',
  'St Kitts & Nevis',
  'St Lucia',
  'Saint Vincent & the Grenadines',
  'Samoa',
  'San Marino',
  'Sao Tome & Principe',
  'Saudi Arabia',
  'Senegal',
  'Serbia',
  'Seychelles',
  'Sierra Leone',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'Solomon Islands',
  'Somalia',
  'South Africa',
  'South Sudan',
  'Spain',
  'Sri Lanka',
  'Sudan',
  'Suriname',
  'Swaziland',
  'Sweden',
  'Switzerland',
  'Syria',
  'Taiwan',
  'Tajikistan',
  'Tanzania',
  'Thailand',
  'Togo',
  'Tonga',
  'Trinidad & Tobago',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Tuvalu',
  'Uganda',
  'Ukraine',
  'United Arab Emirates',
  'United Kingdom',
  'United States',
  'Uruguay',
  'Uzbekistan',
  'Vanuatu',
  'Vatican City',
  'Venezuela',
  'Vietnam',
  'Yemen',
  'Zambia',
  'Zimbabwe',
];

// export const TIMEZONES = timezones;
export const TIMEZONES = moment.tz
  .names()
  .map(t => {
    const timezone = moment.tz(t);
    return {
      text: `(UTC${timezone.format('Z')}) ${t}`.replace('_', ''),
      offset: timezone._offset,
      name: t,
    };
  })
  .sort((a, b) => b.offset - a.offset);

export const LANGUAGES = [
  {
    name: 'English',
    code: 'ENG',
  },
  {
    name: 'Urdu',
    code: 'UR',
  },
];

export const MAX_PASSWORD_LENGTH_WHEN_LOGIN = 32;

export const MIN_PASSWORD_LENGTH_WHEN_CREATING = 8;

export const MAX_PASSWORD_LENGTH_WHEN_CREATING = 24;

// QC Lock Job, sends a Heart Beat after every 2s to BE
export const beatTime = 2000;

// Job Sources - Must be up-to-date with new sources
export const jobSources = ['Tv', 'Online', 'Print', 'Blog', 'Social', 'Ticker'];
export const filterJobSources = ['All', 'Tv', 'Online', 'Print', 'Blog', 'Social', 'Ticker'];

// Ready Job States
export const readyJobStates = ['Ready for QC', 'Ready for Marking', 'Completed'];

export const ACTUS_HOST = 'https://actus.lytics.systems/actus5/';
export const ACTUS_PATH = 'https://actus.lytics.systems/actus5';
export const ACTUS_API_PATH = 'https://actus.lytics.systems/actus5/api';
export const ACTUS_VIDEOS_API_PATH = 'https://actus.lytics.systems/Videos';
export const ACTUS_CHANNELS_API_PATH = 'https://actus.lytics.systems/actus5/api/channels';

// Must be sync
export const uploadPath = 'uploads';

export const APP_RELEASE_VERSION = 'Version 3.0.0';

export const newsBoardStreamEndPoint = 'newsBoard/stream';
export const qcJobsStreamEndPoint = 'jobs/qc-stream';
