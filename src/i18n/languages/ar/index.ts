
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
const ar = {
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
  users: 'المستخدمين',
  user: 'مستخدم',
  userName: 'اسم المستخدم',
  phoneNumber: 'رقم الجوال',
  email: 'البريد الإلكتروني',
  status: 'الحالة',
  active: 'نشط',
  inactive: 'غير نشط',
  actions: 'الإجراءات',
  view: 'عرض',
  edit: 'تعديل',
  delete: 'حذف',
  totalPoints: 'إجمالي النقاط',
  totalTransactions: 'إجمالي التقييمات',
  page: 'صفحة',
  search: 'بحث',
  userDetails: 'بيانات المستخدم',
  userData: 'بيانات المستخدم',
  registrationDate: 'تاريخ الإنضمام',
  convertedPoints: 'عدد النقاط التي تم تحويلها',
  evaluations: 'التقييمات',
  evaluationDate: 'تاريخ التقييم',
  evaluationStatus: 'حالة التقييم',
  companyName: 'اسم الشركة',
  branchName: 'فرع التقييم',
  section: 'القسم المقيم',
  evaluation: 'التقييم',
  evaluationType: 'نوع التقييم',
  directedQuestion: 'سؤال موجه',
  back: 'رجوع'
};

export default ar;
