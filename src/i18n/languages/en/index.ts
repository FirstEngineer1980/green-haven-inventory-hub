
// Import individual translations using named imports
import { auth } from './auth';
import { dashboard } from './dashboard';
import { navigation } from './navigation';
import { survey } from './survey';
import { Landing } from './landing'; // Corrected case
import { plans } from './plans';
import { reviews } from './reviews';
import { customerService } from './customerService';
import { coupons } from './coupons';
import { ads } from './ads';
import { subscriptions } from './subscriptions';
import { misc } from './misc';

// Use a simple object merge approach
const en = {
  ...auth,
  ...dashboard,
  ...navigation,
  ...survey,
  ...Landing, // Corrected case
  ...plans,
  ...reviews,
  ...customerService,
  ...coupons,
  ...ads,
  ...subscriptions,
  ...misc,
  
  // User management
  users: 'Users',
  user: 'User',
  userName: 'User Name',
  phoneNumber: 'Phone Number',
  email: 'Email',
  status: 'Status',
  active: 'Active',
  inactive: 'Inactive',
  actions: 'Actions',
  view: 'View',
  edit: 'Edit',
  delete: 'Delete',
  totalPoints: 'Total Points',
  totalTransactions: 'Total Transactions',
  page: 'Page',
  search: 'Search',
  userDetails: 'User Details',
  userData: 'User Data',
  registrationDate: 'Registration Date',
  convertedPoints: 'Converted Points',
  evaluations: 'Evaluations',
  evaluationDate: 'Evaluation Date',
  evaluationStatus: 'Status',
  companyName: 'Company Name',
  branchName: 'Branch',
  section: 'Section',
  evaluation: 'Evaluation',
  evaluationType: 'Type',
  directedQuestion: 'Directed Question',
  back: 'Back'
};

export default en;
