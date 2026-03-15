import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "dashboard": "Dashboard",
      "events": "Events",
      "teams": "Teams",
      "members": "Members",
      "workshops": "Workshops",
      "timers": "Timers",
      "scoreboard": "Scoreboard",
      "login": "Login",
      "logout": "Logout",
      "my_team": "My Team",
      "invite_members": "Invite Members",
      "admin": "Admin",
      "leader": "Leader",
      "create_event": "Create Event",
      "timer_control": "Timer Control",
      "join": "Join",
      "start": "Start",
      "pause": "Pause",
      "resume": "Resume",
      "finish": "Finish",
      "language": "Language",
      
      // Auth
      "admin_access": "Admin Access",
      "member_login": "Member Login",
      "email": "Email",
      "password": "Password",

      // Events
      "events_management": "Events Management",
      "manage_all_events": "Manage all hackathons and events across the platform.",
      "no_events": "No events found. Create your first hackathon!",
      "create_new_event": "Create New Event",
      "event_details": "Event Details",
      "event_name": "Event Name",
      "description": "Description",
      "schedule_location": "Schedule & Location",
      "start_date": "Start Date",
      "end_date": "End Date",
      "location": "Location",
      "max_teams": "Max Teams",
      "cancel": "Cancel",
      "create": "Create",
      "delete_event": "Delete Event",

      // Teams
      "teams_management": "Teams Management",
      "monitor_teams": "Monitor teams, adjust scores, and manage participation.",
      "team_info": "Team Info",
      "event": "Event",
      "score": "Score",
      "actions": "Actions",
      "no_teams": "No teams registered yet.",
      "points": "Points",

      // Members
      "platform_members": "Platform Members",
      "manage_users": "Manage all registered users and their roles.",
      "user": "User",
      "role": "Role",
      "member": "Member",

      // Workshops
      "workshops_management": "Workshops Management",
      "plan_sessions": "Plan and manage educational sessions for your events.",
      "add_workshop": "Add Workshop",
      "title": "Title",
      "start_time": "Start Time",
      "attach_event": "Attach to Event",
      "filter_event": "Filter by Event:",

      // Leader
      "invite_to_team": "Invite to Team",
      "send_invitations": "Send direct email invitations to your future teammates.",
      "email_address": "Email Address",
      "send_invitation": "Send Invitation",
      "team_members": "Team Members",
      "you_dont_have_team": "You don't have a team yet.",
      "create_one": "Create one or wait to be assigned.",
      "remove_member": "Remove Member",
      
      // Public
      "live_scoreboard": "Live Scoreboard",
      "waiting_event": "Waiting for active event...",
      "loading_scores": "Loading Scores...",
      "no_teams_found": "No teams found",
      "check_back_later": "Check back later once the event starts!",
      "event_workshops": "Event Workshops",
      "join_sessions": "Join our expert-led sessions to level up your skills and maximize your hackathon project."
    }
  },
  fr: {
    translation: {
      "dashboard": "Tableau de Bord",
      "events": "Événements",
      "teams": "Équipes",
      "members": "Membres",
      "workshops": "Ateliers",
      "timers": "Chronomètres",
      "scoreboard": "Classement",
      "login": "Connexion",
      "logout": "Déconnexion",
      "my_team": "Mon Équipe",
      "invite_members": "Inviter des Membres",
      "admin": "Admin",
      "leader": "Chef",
      "create_event": "Créer un Événement",
      "timer_control": "Contrôle du Temps",
      "join": "Rejoindre",
      "start": "Démarrer",
      "pause": "Pause",
      "resume": "Reprendre",
      "finish": "Terminer",
      "language": "Langue",

      "admin_access": "Accès Administrateur",
      "member_login": "Connexion Membre",
      "email": "Email",
      "password": "Mot de passe",

      "events_management": "Gestion des Événements",
      "manage_all_events": "Gérez tous les hackathons et événements sur la plateforme.",
      "no_events": "Aucun événement trouvé. Créez votre premier hackathon !",
      "create_new_event": "Créer un Nouvel Événement",
      "event_details": "Détails de l'Événement",
      "event_name": "Nom de l'Événement",
      "description": "Description",
      "schedule_location": "Programme & Lieu",
      "start_date": "Date de Début",
      "end_date": "Date de Fin",
      "location": "Lieu",
      "max_teams": "Équipes Max",
      "cancel": "Annuler",
      "create": "Créer",
      "delete_event": "Supprimer l'Événement",

      "teams_management": "Gestion des Équipes",
      "monitor_teams": "Surveillez les équipes, ajustez les scores et gérez la participation.",
      "team_info": "Info Équipe",
      "event": "Événement",
      "score": "Score",
      "actions": "Actions",
      "no_teams": "Aucune équipe inscrite pour le moment.",
      "points": "Points",

      "platform_members": "Membres de la Plateforme",
      "manage_users": "Gérez tous les utilisateurs inscrits et leurs rôles.",
      "user": "Utilisateur",
      "role": "Rôle",
      "member": "Membre",

      "workshops_management": "Gestion des Ateliers",
      "plan_sessions": "Planifiez et gérez les sessions éducatives pour vos événements.",
      "add_workshop": "Ajouter un Atelier",
      "title": "Titre",
      "start_time": "Heure de Début",
      "attach_event": "Associer à un Événement",
      "filter_event": "Filtrer par Événement :",

      "invite_to_team": "Inviter dans l'Équipe",
      "send_invitations": "Envoyez des invitations directes par email à vos futurs coéquipiers.",
      "email_address": "Adresse Email",
      "send_invitation": "Envoyer l'Invitation",
      "team_members": "Membres de l'Équipe",
      "you_dont_have_team": "Vous n'avez pas encore d'équipe.",
      "create_one": "Créez-en une ou attendez d'être assigné.",
      "remove_member": "Retirer le Membre",

      "live_scoreboard": "Classement en Direct",
      "waiting_event": "En attente d'un événement actif...",
      "loading_scores": "Chargement des Scores...",
      "no_teams_found": "Aucune équipe trouvée",
      "check_back_later": "Revenez plus tard une fois l'événement commencé !",
      "event_workshops": "Ateliers de l'Événement",
      "join_sessions": "Rejoignez nos sessions animées par des experts pour améliorer vos compétences."
    }
  },
  ar: {
    translation: {
      "dashboard": "لوحة القيادة",
      "events": "الفعاليات",
      "teams": "الفرق",
      "members": "الأعضاء",
      "workshops": "ورش العمل",
      "timers": "المؤقتات",
      "scoreboard": "لوحة النتائج",
      "login": "تسجيل الدخول",
      "logout": "تسجيل الخروج",
      "my_team": "فريقي",
      "invite_members": "دعوة الأعضاء",
      "admin": "مشرف",
      "leader": "قائد",
      "create_event": "إنشاء فعالية",
      "timer_control": "التحكم في الوقت",
      "join": "انضمام",
      "start": "ابدأ",
      "pause": "إيقاف مؤقت",
      "resume": "استئناف",
      "finish": "إنهاء",
      "language": "اللغة",

      "admin_access": "وصول المشرف",
      "member_login": "تسجيل دخول العضو",
      "email": "البريد الإلكتروني",
      "password": "كلمة المرور",

      "events_management": "إدارة الفعاليات",
      "manage_all_events": "إدارة جميع الفعاليات والأحداث عبر المنصة.",
      "no_events": "لم يتم العثور على فعاليات. قم بإنشاء الفعالية الأولى الخاصة بك!",
      "create_new_event": "إنشاء فعالية جديدة",
      "event_details": "تفاصيل الفعالية",
      "event_name": "اسم الفعالية",
      "description": "الوصف",
      "schedule_location": "الجدول الزمني والموقع",
      "start_date": "تاريخ البدء",
      "end_date": "تاريخ الانتهاء",
      "location": "الموقع",
      "max_teams": "الحد الأقصى للفرق",
      "cancel": "إلغاء",
      "create": "إنشاء",
      "delete_event": "حذف الفعالية",

      "teams_management": "إدارة الفرق",
      "monitor_teams": "مراقبة الفرق وتعديل النتائج وإدارة المشاركة.",
      "team_info": "معلومات الفريق",
      "event": "الفعالية",
      "score": "النتيجة",
      "actions": "الإجراءات",
      "no_teams": "لا توجد فرق مسجلة بعد.",
      "points": "نقاط",

      "platform_members": "أعضاء المنصة",
      "manage_users": "إدارة جميع المستخدمين المسجلين وأدوارهم.",
      "user": "المستخدم",
      "role": "الدور",
      "member": "عضو",

      "workshops_management": "إدارة ورش العمل",
      "plan_sessions": "تخطيط وإدارة الجلسات التعليمية لفعالياتك.",
      "add_workshop": "إضافة ورشة عمل",
      "title": "العنوان",
      "start_time": "وقت البدء",
      "attach_event": "اربط بالفعالية",
      "filter_event": "تصفية حسب الفعالية:",

      "invite_to_team": "دعوة للفريق",
      "send_invitations": "إرسال دعوات عبر البريد الإلكتروني المباشر لزملائك المستقبليين.",
      "email_address": "عنوان البريد الإلكتروني",
      "send_invitation": "إرسال الدعوة",
      "team_members": "أعضاء الفريق",
      "you_dont_have_team": "ليس لديك فريق بعد.",
      "create_one": "قم بإنشاء واحد أو انتظر حتى يتم تعيينك.",
      "remove_member": "إزالة عضو",

      "live_scoreboard": "لوحة النتائج المباشرة",
      "waiting_event": "في انتظار الحدث النشط...",
      "loading_scores": "جاري تحميل النتائج...",
      "no_teams_found": "لم يتم العثور على فرق",
      "check_back_later": "تحقق مرة أخرى لاحقًا بمجرد بدء الحدث!",
      "event_workshops": "ورش عمل الحدث",
      "join_sessions": "انضم إلى جلساتنا بقيادة الخبراء لرفع مستوى مهاراتك."
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
