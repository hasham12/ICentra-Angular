import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule, Router, Event } from '@angular/router';
// Router Guards
import { BeforeLoginService } from './services/auth/before-login.service';
import { AfterLoginService } from './services/auth/after-login.service';
import { NgxPermissionsGuard } from 'ngx-permissions';

// Login
import { AccessDeniedComponent } from './common/access-denied/access-denied.component';
import { LoginComponent } from './components/Auth/login/login.component';
import { ForgetpasswordComponent } from './components/Auth/forgetpassword/forgetpassword.component';
// Default
import { FullComponent } from './layouts/full/full.component';
import { BlankComponent } from './layouts/blank/blank.component';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SearchComponent } from './common/search/search.component';
import { LibraryManagerComponent } from './common/library-manager/library-manager.component';


// Template
import { DesignComponent } from './components/templates/design/design.component';
import { CreateComponent } from './components/templates/create/create.component';
import { MyDesignComponent } from './components/templates/my-design/my-design.component';
import { WebsiteComponent } from './components/templates/website/website.component';
import { PrivateComponent } from './components/templates/library/private/private.component';
import { IcentraComponent } from './components/templates/library/icentra/icentra.component';
import { ReceivedComponent } from './components/templates/library/received/received.component';
import { LibOfficeComponent } from './components/templates/library/office/office.component';
// My Tasks
import { MyTasksComponent } from './components/my-tasks/my-tasks/my-tasks.component';
import { AllTasksComponent } from './components/my-tasks/all-tasks/all-tasks.component';
import { IncompleteComponent } from './components/my-tasks/incomplete/incomplete.component';
import { CompleteComponent } from './components/my-tasks/complete/complete.component';
import { InprogressComponent } from './components/my-tasks/inprogress/inprogress.component';
import { CreateTaskComponent } from './components/my-tasks/create-task/create-task.component';
import { MultipleTasksComponent } from './components/my-tasks/create-task/multiple-tasks/multiple-tasks.component';

// Reports
import { AllReportsComponent } from './components/reports/all-reports/all-reports.component';
import { CreateReportComponent } from './components/reports/create-report/create-report.component';
import { MyReportComponent } from './components/reports/my-report/my-report.component';
import { ViewReportComponent } from './components/reports/view-reports/view-reports.component';
// My Profile
import { YourProfileComponent } from './components/my-profile/your-profile/your-profile.component';

// Setting
import { GeneralComponent } from './components/setting/general/general.component';
// users
import { UsersComponent } from './components/setting/users/users.component';
import { AddNewUserComponent } from './components/setting/users/add-new-user/add-new-user.component';
import { EditUserComponent } from './components/setting/users/edit-user/edit-user.component';
// user > groups
import { GroupsComponent } from './components/setting/users/groups/groups.component';
import { AddGroupComponent } from './components/setting/users/groups/add-group/add-group.component';
import { EditGroupComponent } from './components/setting/users/groups/edit-group/edit-group.component';
// user > office
import { OfficeComponent } from './components/setting/users/office/office.component';
import { AddOfficeComponent } from './components/setting/users/office/add-office/add-office.component';
import { EditOfficeComponent } from './components/setting/users/office/edit-office/edit-office.component';
// permissions
import { PermissionsComponent } from './components/setting/users/permissions/permissions.component';
// User Level
import { UserLevelComponent } from './components/setting/users/user-level/user-level.component';
    import { AddUserLevelComponent } from './components/setting/users/user-level/add-user-level/add-user-level.component';
    import { EditUserLevelComponent } from './components/setting/users/user-level/edit-user-level/edit-user-level.component';
// Templates Category
import { TemplatesComponent } from './components/setting/templates/category/templates/templates.component';
// Image Category
import { ImageComponent } from './components/setting/templates/category/image/image.component';
// Icons Category
import { IcnComponent } from './components/setting/templates/category/icons/icons.component';
// Background Category
import { BgComponent } from './components/setting/templates/category/background/background.component';
// Templates
import { SiteimagesComponent } from './components/setting/templates/images/siteimages/siteimages.component';
import { BgimagesComponent } from './components/setting/templates/images/bgimages/bgimages.component';
import { BgpatternsComponent } from './components/setting/templates/images/bgpatterns/bgpatterns.component';
import { ImportsComponent } from './components/setting/templates/images/imports/imports.component';
    import { VectoriconsComponent } from './components/setting/templates/vector/icons/vectoricons.component';
    import { VectorshapesComponent } from './components/setting/templates/vector/shapes/vectorshapes.component';
    import { CanvaspagesComponent } from './components/setting/templates/canvas/pages/canvaspages.component';
    import { CanvasTemplatesComponent } from './components/setting/templates/canvas/templates/canvastemplates.component';
    import { FontsComponent } from './components/setting/templates/canvas/fonts/fonts.component';
// Task Manager
import { TasksManagerComponent } from './components/setting/tasks-manager/tasks-manager.component';
    import { JobTypeComponent } from './components/setting/tasks-manager/job-type/job-type.component';
           import { AddJobTypeComponent } from './components/setting/tasks-manager/job-type/add-job-type/add-job-type.component';
           import { EditJobTypeComponent } from './components/setting/tasks-manager/job-type/edit-job-type/edit-job-type.component';
    import { TaskCategoryComponent } from './components/setting/tasks-manager/category/category.component';
            import { AddTaskCategoryComponent } from './components/setting/tasks-manager/category/add-task-category/add-task-category.component';
            import { EditTaskCategoryComponent } from './components/setting/tasks-manager/category/edit-task-category/edit-task-category.component';
    import { StatusComponent } from './components/setting/tasks-manager/status/status.component';
            import { AddStatusComponent } from './components/setting/tasks-manager/status/add-status/add-status.component';
            import { EditStatusComponent } from './components/setting/tasks-manager/status/edit-status/edit-status.component';
    import { PriorityComponent } from './components/setting/tasks-manager/priority/priority.component';
            import { AddPriorityComponent } from './components/setting/tasks-manager/priority/add-priority/add-priority.component';
            import { EditPriorityComponent } from './components/setting/tasks-manager/priority/edit-priority/edit-priority.component';
    import { MarketingComponent } from './components/setting/tasks-manager/marketing/marketing.component';
            import { AddMarketingComponent } from './components/setting/tasks-manager/marketing/add-marketing/add-marketing.component';
            import { EditMarketingComponent } from './components/setting/tasks-manager/marketing/edit-marketing/edit-marketing.component';
    import { PrintingComponent } from './components/setting/tasks-manager/printing/printing.component';
            import { AddPrintingComponent } from './components/setting/tasks-manager/printing/add-printing/add-printing.component';
            import { EditPrintingComponent } from './components/setting/tasks-manager/printing/edit-printing/edit-printing.component';
// Site Settings
import { SiteSettingsComponent } from './components/setting/site-settings/site-settings.component';
import { LicenseComponent } from './components/setting/site-settings/license/license.component';
import { SoftwareComponent } from './components/setting/site-settings/software/software.component';
import { PaymentComponent } from './components/setting/site-settings/payment/payment.component';

import { RolesComponent } from './components/setting/users/roles/roles.component';
import { AddRoleComponent } from './components/setting/users/roles/add-role/add-role.component';
import { EditRoleComponent } from './components/setting/users/roles/edit-role/edit-role.component';
import { ResetpasswordComponent } from './components/Auth/resetpassword/resetpassword.component';
import {EditTaskComponent} from './components/my-tasks/edit-task/edit-task.component';
import {ViewTaskComponent} from './components/my-tasks/view-task/view-task.component';
import {TaskDraftComponent} from './components/my-tasks/task-draft/task-draft.component';
import {TaskBoardComponent} from './components/my-tasks/task-board/task-board.component';
import {LibrarySettingsComponent} from './components/setting/general/library-settings/library-settings.component';

const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    canActivate: [AfterLoginService],
    children: [
        {
          path: 'access-denied',
          component: AccessDeniedComponent,
      },
      {
          path: '',
          component: DashboardComponent,
            data: {
            title: 'Dashboard',
            breadcrumb: [
              {label: 'Home', url: '/'},
              {label: 'Dashboard', url: ''}
            ]
        },
      },
      // Search
      { path: 'search',
          component: SearchComponent,
          data: {
            title: 'search',
            breadcrumb: [
              {label: 'Dashboard', url: '/'},
              {label: 'search', url: ''}
            ]
        },
      },
      // Search
      { path: 'library',
          component: LibraryManagerComponent,
          data: {
            title: 'library',
            breadcrumb: [
              {label: 'Dashboard', url: '/'},
              {label: 'search', url: ''}
            ]
        },
      },
      // Template
      { path: 'template/design',
          component: DesignComponent,
          data: {
            title: 'Design',
            breadcrumb: [
              {label: 'Dashboard', url: '/'},
              {label: 'Template', url: ''},
              {label: 'Select Design', url: ''}
            ]
        },
      },
      { path: 'template/template-create',
          component: CreateComponent,
          data: {
            title: 'Create',
            breadcrumb: [
              {label: 'Dashboard', url: '/'},
              {label: 'Template', url: ''},
              {label: 'Create ', url: ''}
            ]
        },
      },
      { path: 'template/my-designs',
          component: MyDesignComponent,
          data: {
            title: 'My Designs',
            breadcrumb: [
              {label: 'Dashboard',url: '/'},
              {label: 'Template',url: ''},
              {label: 'My Designs ',url: ''}
            ]
        },
      },
      { path: 'template/website',
          component: WebsiteComponent,
          data: {
            title: 'Website',
            breadcrumb: [
              {label: 'Dashboard', url: '/'},
              {label: 'Template', url: ''},
              {label: 'Website ', url: ''}
            ]
        },
      },
      { path: 'template/library',
          component: PrivateComponent,
          data: {
            title: 'Library',
            breadcrumb: [
              {label: 'Dashboard', url: '/'},
              {label: 'template', url: ''},
              {label: 'Library ', url: ''}
            ]
        },
      },
      { path: 'template/library/private',
          component: PrivateComponent,
          data: {
            title: 'private',
            breadcrumb: [
              {label: 'Dashboard', url: '/'},
              {label: 'Library', url: '/template/library'},
              {label: 'private ', url: ''}
            ]
        },
      },
      { path: 'template/library/icentra',
          component: IcentraComponent,
          data: {
            title: 'Icentra',
            breadcrumb: [
              {label: 'Dashboard', url: '/'},
              {label: 'Library', url: '/template/library'},
              {label: 'Icentra ', url: ''}
            ]
        },
      },
      { path: 'template/library/received',
          component: ReceivedComponent,
          data: {
            title: 'Received',
            breadcrumb: [
              {label: 'Dashboard', url: '/'},
              {label: 'Library', url: '/template/library'},
              {label: 'Received ', url: ''}
            ]
        },
      },
      { path: 'template/library/office',
          component: LibOfficeComponent,
          data: {
            title: 'Office',
            breadcrumb: [
              {label: 'Dashboard', url: '/'},
              {label: 'Library', url: '/template/library'},
              {label: 'Office ', url: '/office'}
            ]
        },
      },
      { path: 'template/template-create/:designid', component: CreateComponent },
      { path: 'template/template-create/:userid/:designid', component: CreateComponent },

      // My Tasks
      { path: 'tasks/my-tasks',
          component: MyTasksComponent,
          data: {
            title: 'My Tasks',
            breadcrumb: [
              {label: 'Dashboard', url: '/'},
              {label: 'Tasks', url: ''},
              {label: 'My Tasks ', url: ''}
            ]
        },
      },
      { path: 'tasks/all-tasks',
          component: AllTasksComponent,
          canActivate: [NgxPermissionsGuard],
          data: {
              permissions: {
                  only: ['task.view.all'],
                  redirectTo: '/access-denied'
              },
              title: 'All Tasks',
            breadcrumb: [
              {label: 'Dashboard', url: '/'},
              {label: 'Tasks', url: ''},
              {label: 'All Tasks ', url: ''}
            ]
        },
      },
      { path: 'tasks/board',
          component: TaskBoardComponent,
          data: {
            title: 'Task Board',
            breadcrumb: [
              {label: 'Dashboard',url: '/'},
              {label: 'Tasks',url: ''},
              {label: 'Board',url: ''}
            ]
          },
        },
      { path: 'tasks/incomplete',
          component: IncompleteComponent,
          data: {
            title: 'Incomplete',
            breadcrumb: [
              {label: 'Dashboard',url: '/'},
              {label: 'Tasks',url: ''},
              {label: 'Incomplete ',url: ''}
            ]
        },
      },
      { path: 'tasks/complete',
          component: CompleteComponent,
          data: {
            title: 'Complete',
            breadcrumb: [
              {label: 'Dashboard',url: '/'},
              {label: 'Tasks',url: ''},
              {label: 'Complete ',url: ''}
            ]
        },
      },
      { path: 'tasks/inprogress',
          component: InprogressComponent,
          data: {
            title: 'Inprogress',
            breadcrumb: [
              {label: 'Dashboard',url: '/'},
              {label: 'Tasks',url: ''},
              {label: 'Inprogress ',url: ''}
            ]
        },
      },
      { path: 'tasks/create-task',
          component: CreateTaskComponent,
          canActivate: [NgxPermissionsGuard],
          data: {
              permissions: {
                  only: ['task.create'],
                  redirectTo: '/access-denied'
              },
            title: 'Create',
            breadcrumb: [
              {label: 'Dashboard',url: '/'},
              {label: 'Tasks',url: ''},
              {label: 'Create',url: ''}
            ]
        },
      },
        { path: 'tasks/draft',
            component: TaskDraftComponent,
            data: {
                title: 'Draft',
                breadcrumb: [
                    {label: 'Dashboard',url: '/'},
                    {label: 'Tasks',url: ''},
                    {label: 'Draft',url: ''}
                ]
            },
        },
      { path: 'tasks/multiple-task',
          component: MultipleTasksComponent,
          canActivate: [NgxPermissionsGuard],
          data: {
              permissions: {
                  only: ['task.create'],
                  redirectTo: '/access-denied'
              },
            title: 'Marketer',
            breadcrumb: [
              {label: 'Dashboard',url: '/'},
              {label: 'Tasks',url: ''},
              {label: 'Marketer',url: ''}
            ]
        },
      },
        { path: 'tasks/edit-task/:taskId',
            component: EditTaskComponent,
            canActivate: [NgxPermissionsGuard],
            data: {
                permissions: {
                    only: ['task.edit'],
                    redirectTo: '/access-denied'
                },
                title: 'Edit',
                breadcrumb: [
                    {label: 'Dashboard',url: '/'},
                    {label: 'Tasks',url: ''},
                    {label: 'Edit',url: ''}
                ]
            },
        },
        { path: 'tasks/view-task/:id',
            component: ViewTaskComponent,
            data: {
                title: 'view',
                breadcrumb: [
                    {label: 'Dashboard',url: '/'},
                    {label: 'Tasks',url: ''},
                    {label: 'View',url: ''}
                ]
            },
        },

      // Reports
      { path: 'report/all-reports',
          component: AllReportsComponent,
          data: {
            title: 'All Reports',
            breadcrumb: [
              {label: 'Dashboard', url: '/'},
              {label: 'Report', url: ''},
              {label: 'All Reports', url: ''}
            ]
        },
      },
      { path: 'report/create-report',
          component: CreateReportComponent,
          data: {
            title: 'Create',
            breadcrumb: [
              {label: 'Dashboard', url: '/'},
              {label: 'Report', url: ''},
              {label: 'Create', url: ''}
            ]
        },
      },
      { path: 'report/my-report',
          component: MyReportComponent,
          data: {
            title: 'My Report',
            breadcrumb: [
              {label: 'Dashboard', url: '/'},
              {label: 'Report', url: ''},
              {label: 'My Report', url: ''}
            ]
        },
      },
        { path: 'report/view/:id',
            component: ViewReportComponent,
            data: {
                title: 'View Reports',
                breadcrumb: [
                    {label: 'Dashboard', url: '/'},
                    {label: 'Report', url: ''},
                    {label: 'All Reports', url: ''}
                ]
            },
        },

      // My Profile
      { path: 'user/profile',
          component: YourProfileComponent,
          data: {
            title: 'Profile',
            breadcrumb: [
              {label: 'Dashboard',url: '/'},
              {label: 'Profile',url: ''}
            ]
        },
      },

      // Setting
        { path: 'setting/general',
            component: GeneralComponent,
            data: {
                title: 'General',
                breadcrumb: [
                    {label: 'Dashboard',url: '/'},
                    {label: 'Setting',url: ''},
                    {label: 'General',url: ''},
                ]
            },
        },
        { path: 'setting/general/library',
            component: LibrarySettingsComponent,
            data: {
                title: 'Library Settings',
                breadcrumb: [
                    {label: 'Dashboard',url: '/'},
                    {label: 'Setting',url: ''},
                    {label: 'General',url: ''},
                    {label: 'Library',url: ''},
                ]
            },
        },
      { path: 'setting/notifications',
          component: GeneralComponent,
          data: {
            title: 'Notifications',
            breadcrumb: [
              {label: 'Dashboard',url: '/'},
              {label: 'Setting',url: ''},
              {label: 'Notifications',url: ''},
            ]
        },
      },

      // Users
      { path: 'setting/list',
          component: UsersComponent,
          canActivate: [NgxPermissionsGuard],
          data: {
            permissions: {
              only: ['user.add', 'user.edit', 'user.list', 'offices.manage', 'groups.manage', 'permissions.manage'],
              redirectTo: '/access-denied'
            },
            title: 'Users',
            breadcrumb: [
              {label: 'Dashboard', url: '/'},
              {label: 'Setting', url: ''},
              {label: 'Users', url: ''},
            ]
        },
      },
      { path: 'setting/list/users',
          component: UsersComponent,
          canActivate: [NgxPermissionsGuard],
          data: {
            permissions: {
              only: ['user.add', 'user.edit', 'user.list', 'offices.manage', 'groups.manage', 'permissions.manage'],
              redirectTo: '/access-denied'
            },
            title: 'Users',
            breadcrumb: [
              {label: 'Dashboard', url: '/'},
              {label: 'Setting', url: ''},
              {label: 'Users', url: ''},
            ]
        },
      },
      { path: 'setting/list/users/add',
          component: AddNewUserComponent,
          canActivate: [NgxPermissionsGuard],
          data: {
            permissions: {
              only: 'user.add',
              redirectTo: '/access-denied'
            },
            title: 'Add',
            breadcrumb: [
              {label: 'Dashboard', url: '/'},
              {label: 'Setting', url: ''},
              {label: 'Users', url: '/setting/list/users'},
              {label: 'Add', url: ''},
            ],

        },
      },
      { path: 'setting/list/users/edit/:id',
          component: EditUserComponent,
          canActivate: [NgxPermissionsGuard],
          data: {
            permissions: {
              only: 'user.edit',
              redirectTo: '/access-denied'
            },
            title: 'Edit',
            breadcrumb: [
              {label: 'Dashboard',url: '/'},
              {label: 'Setting',url: ''},
              {label: 'Users',url: '/setting/list/users'},
              {label: 'Edit',url: ''},
            ],
        },
      },
        { path: 'setting/list/users/level',
            component: UserLevelComponent,
            data: {
                title: 'User Levels',
                breadcrumb: [
                    {label: 'Dashboard',url: '/'},
                    {label: 'Setting',url: ''},
                    {label: 'Users',url: '/setting/list/users'},
                    {label: 'Level',url: ''},
                ],
                permissions: {

                }
            },
        },
        { path: 'setting/list/users/level/add',
            component: AddUserLevelComponent,
            data: {
                title: 'Add',
                breadcrumb: [
                    {label: 'Dashboard',url: '/'},
                    {label: 'Users',url: '/setting/list/users'},
                    {label: 'Level',url: ''},
                    {label: 'Add',url: ''},
                ],
                permissions: {

                }
            },
        },
        { path: 'setting/list/users/level/edit/:id',
            component: EditUserLevelComponent,
            data: {
                title: 'Edit',
                breadcrumb: [
                    {label: 'Dashboard',url: '/'},
                    {label: 'Users',url: '/setting/list/users'},
                    {label: 'Level',url: ''},
                    {label: 'Edit',url: ''},
                ],
                permissions: {

                }
            },
        },
      // Groups
      { path: 'setting/list/groups',
          component: GroupsComponent,
          canActivate: [NgxPermissionsGuard],
          data: {
            permissions: {
              only: 'groups.manage',
              redirectTo: '/access-denied'
            },
            title: 'Groups',
            breadcrumb: [
              {label: 'Dashboard',url: '/'},
              {label: 'Setting',url: '/setting/list'},
              {label: 'Groups',url: ''},
            ]
        },
      },
      { path: 'setting/list/groups/add',
          component: AddGroupComponent,
          canActivate: [NgxPermissionsGuard],
          data: {
            permissions: {
              only: 'groups.manage',
              redirectTo: '/access-denied'
            },
            title: 'Add',
            breadcrumb: [
              {label: 'Dashboard', url: '/'},
              {label: 'Setting', url: '/setting/list'},
              {label: 'Groups', url: '/setting/groups'},
              {label: 'Add', url: ''},
            ],
        },
      },
      { path: 'setting/list/groups/edit/:id',
          component: EditGroupComponent,
          canActivate: [NgxPermissionsGuard],
          data: {
            permissions: {
              only: 'groups.manage',
              redirectTo: '/access-denied'
            },
            title: 'Edit',
            breadcrumb: [
              {label: 'Dashboard', url: '/'},
              {label: 'Setting', url: '/setting/list'},
              {label: 'Groups', url: '/setting/groups'},
              {label: 'Edit', url: ''},
            ],
        },
      },
      // Roles
      { path: 'setting/list/roles',
          component: RolesComponent,
          canActivate: [NgxPermissionsGuard],
          data: {
            permissions: {
              only: 'permissions.manage',
              redirectTo: '/access-denied'
            },
            title: 'Roles',
            breadcrumb: [
              {label: 'Dashboard', url: '/'},
              {label: 'Setting', url: '/setting/list'},
              {label: 'Roles', url: ''},
            ]
        },
      },
      { path: 'setting/list/roles/add',
          component: AddRoleComponent,
          canActivate: [NgxPermissionsGuard],
          data: {
            permissions: {
              only: 'permissions.manage',
            },
            title: 'Add',
            breadcrumb: [
              {label: 'Dashboard', url: '/'},
              {label: 'Setting', url: '/setting/list'},
              {label: 'Roles', url: '/setting/list/roles'},
              {label: 'Add', url: ''},
            ]
        },
      },
      { path: 'setting/list/roles/edit/:id',
          component: EditRoleComponent,
          canActivate: [NgxPermissionsGuard],
          data: {
            title: 'Edit',
            permissions: {
              only: 'permissions.manage',
            },
            breadcrumb: [
              {label: 'Dashboard', url: '/'},
              {label: 'Setting', url: '/setting/list'},
              {label: 'Roles', url: '/setting/list/roles'},
              {label: 'Edit', url: ''},
            ]
        },
      },
      // Office
      { path: 'setting/list/offices',
          component: OfficeComponent,
          canActivate: [NgxPermissionsGuard],
          data: {
            permissions: {
              only: 'offices.manage',
            },
            title: 'Offices',
            breadcrumb: [
              {label: 'Dashboard', url: '/'},
              {label: 'Setting', url: ''},
              {label: 'Offices', url: ''},
            ]
        },
      },
      { path: 'setting/list/offices/add',
          component: AddOfficeComponent,
          canActivate: [NgxPermissionsGuard],
          data: {
            permissions: {
              only: 'offices.manage',
            },
            title: 'Add',
            breadcrumb: [
              {label: 'Dashboard', url: '/'},
              {label: 'Setting', url: ''},
              {label: 'Offices', url: '/setting/list/offices'},
              {label: 'Add', url: ''},
            ],
        },
      },
      { path: 'setting/list/offices/edit/:id',
          component: EditOfficeComponent,
          canActivate: [NgxPermissionsGuard],
          data: {
            title: 'Edit',
            permissions: {
              only: 'offices.manage',
            },
            breadcrumb: [
              {label: 'Dashboard', url: '/'},
              {label: 'Setting', url: ''},
              {label: 'Offices', url: '/setting/list/offices'},
              {label: 'Edit', url: ''},
            ],
        },
      },
      { path: 'setting/list/permissions',
          component: PermissionsComponent,
          canActivate: [NgxPermissionsGuard],
          data: {
            permissions: {
              only: 'permissions.manage',
            },
            title: 'Permissions',
            breadcrumb: [
              {label: 'Dashboard', url: '/'},
              {label: 'Setting', url: ''},
              {label: 'Permissions', url: ''},
            ]
        },
      },
      // Setting Template siteimages
      { path: 'setting/templates',
          component: SiteimagesComponent,
          data: {
            title: 'Images',
            breadcrumb: [
              {label: 'Dashboard', url: '/'},
              {label: 'Templates', url: ''},
              {label: 'Images', url: ''},
            ]
        },
      },
      { path: 'setting/templates/images/siteimages',
          component: SiteimagesComponent,
          data: {
            title: 'Images',
            breadcrumb: [
              {label: 'Dashboard', url: '/'},
              {label: 'Templates', url: '/setting/templates'},
              {label: 'Images', url: ''},
            ]
        },
      },
      // Setting Template bgimages
      { path: 'setting/templates/images/bgimages',
          component: BgimagesComponent,
          data: {
            title: 'BgImages',
            breadcrumb: [
              {label: 'Dashboard', url: '/'},
              {label: 'Templates', url: '/setting/templates'},
              {label: 'BgImages', url: ''},
            ]
        },
      },
      // Setting Template bgpatterns
      { path: 'setting/templates/images/bgpatterns',
          component: BgpatternsComponent,
          data: {
            title: 'Patterns',
            breadcrumb: [
              {label: 'Dashboard', url: '/'},
              {label: 'Setting', url: ''},
              {label: 'Templates', url: ''},
            ]
        },
      },
      // Setting Template Imports
      { path: 'setting/templates/images/imports',
          component: ImportsComponent,
          data: {
            title: 'Imports',
            breadcrumb: [
              {label: 'Dashboard', url: '/'},
              {label: 'Setting', url: ''},
              {label: 'Templates', url: ''},
            ]
        },
      },
      // Setting Template Category
      { path: 'setting/templates/category/templates',
          component: TemplatesComponent,
          data: {
            title: 'Templates',
            breadcrumb: [
              {label: 'Dashboard', url: '/'},
              {label: 'Category', url: '/setting/templates/category/templates'},
              {label: 'Templates', url: ''},

            ]
        },
      },
      // Setting Image Category
      { path: 'setting/templates/category/image',
          component: ImageComponent,
          data: {
            title: 'Image',
            breadcrumb: [
              {label: 'Dashboard', url: '/'},
              {label: 'Templates', url: '/setting/templates'},
              {label: 'Image', url: ''},
            ]
        },
      },
      // Setting Icons Category
      { path: 'setting/templates/category/icons',
          component: IcnComponent,
          data: {
            title: 'Icon',
            breadcrumb: [
              {label: 'Dashboard', url: '/'},
              {label: 'Templates', url: '/setting/templates'},
              {label: 'Icon', url: ''},
            ]
        },
      },
      // Setting Background Category
      { path: 'setting/templates/category/background',
          component: BgComponent,
          data: {
            title: 'Background',
            breadcrumb: [
              {label: 'Dashboard', url: '/'},
              {label: 'Templates', url: '/setting/templates'},
              {label: 'Background', url: ''},
            ]
        },
      },
      { path: 'setting/templates/vector/icons',
          component: VectoriconsComponent,
          data: {
            title: 'Icons',
            breadcrumb: [
              {label: 'Dashboard',url: '/'},
              {label: 'Templates',url: '/setting/templates'},
              {label: 'Icons',url: ''},
            ]
        },
      },
      // Setting Vector Shapesshapes
      { path: 'setting/templates/vector/shapes',
          component: VectorshapesComponent,
          data: {
            title: 'Shapes',
            breadcrumb: [
              {label: 'Dashboard',url: '/'},

              {label: 'Templates',url: '/setting/templates'},
              {label: 'Canvas',url: ''},

            ]
        },
      },
      // Setting Canvas Pages
      { path: 'setting/templates/canvas/pages',
          component: CanvaspagesComponent,
          data: {
            title: 'Pages',
            breadcrumb: [
              {label: 'Dashboard',url: '/'},
              {label: 'Setting',url: ''},
              {label: 'Templates',url: ''},

            ]
        },
      },
      // Setting Canvas Templates
      { path: 'setting/templates/canvas/templates',
          component: CanvasTemplatesComponent,
          data: {
            title: 'Pages',
            breadcrumb: [
              {label: 'Dashboard',url: '/'},
              {label: 'Setting',url: ''},
              {label: 'Templates',url: ''},

            ]
        },
      },
      // Setting Canvas fonts
      { path: 'setting/templates/canvas/fonts',
          component: FontsComponent,
          data: {
            title: 'Fonts',
            breadcrumb: [
              {label: 'Dashboard',url: '/'},
              {label: 'Setting',url: ''},
              {label: 'Templates',url: ''},
            ]
        },
      },
      // Task Manager
      { path: 'setting/tasks',
          component: JobTypeComponent,
          data: {
            title: 'Job Type',
            breadcrumb: [
              {label: 'Dashboard',url: '/'},
              {label: 'Task Manager',url: '/setting/tasks'},
              {label: 'Job Type',url: ''},
            ]
        },
      },
            { path: 'setting/tasks/job-type',
                component: JobTypeComponent,
                data: {
                  title: 'Job Type',
                  breadcrumb: [
                    {label: 'Dashboard',url: '/'},
                    {label: 'Task Manager',url: '/setting/tasks'},
                    {label: 'Job Type',url: ''},
                  ]
              },
            },
            { path: 'setting/tasks/job-type/add',
                component: AddJobTypeComponent,
                data: {
                  title: 'Create Job Type',
                  breadcrumb: [
                    {label: 'Dashboard',url: '/'},
                    {label: 'Task Manager',url: '/setting/tasks'},
                    {label: 'Job Type',url: '/setting/tasks/job-type'},
                    {label: 'Create Job Type',url: ''},
                  ]
              },
            },
            { path: 'setting/tasks/job-type/edit/:id',
                component: EditJobTypeComponent,
                data: {
                  title: 'Edit Job Type',
                  breadcrumb: [
                    {label: 'Dashboard',url: '/'},
                    {label: 'Task Manager',url: '/setting/tasks'},
                    {label: 'Job Type',url: '/setting/tasks/job-type'},
                    {label: 'Edit Job Type',url: ''},
                  ]
              },
            },
      { path: 'setting/tasks/category',
          component: TaskCategoryComponent,
          canActivate: [NgxPermissionsGuard],
          data: {
              permissions: {
                  only: ['task.printing.manager'],
                  redirectTo: '/access-denied'
              },
            title: 'Categories',
            breadcrumb: [
              {label: 'Dashboard',url: '/'},
              {label: 'Task Manager',url: '/setting/tasks'},
              {label: 'Categories',url: ''},
            ]
        },
      },
        { path: 'setting/tasks/category/add',
              component: AddTaskCategoryComponent,
            canActivate: [NgxPermissionsGuard],
            data: {
                permissions: {
                    only: ['task.printing.manager'],
                    redirectTo: '/access-denied'
                },
                title: 'Create Category',
                breadcrumb: [
                  {label: 'Dashboard',url: '/'},
                  {label: 'Task Manager',url: '/setting/tasks'},
                  {label: 'Categories',url: '/setting/tasks/category'},
                  {label: 'Create Category',url: ''},
                ]
            },
        },
        { path: 'setting/tasks/category/edit/:id',
              component: EditTaskCategoryComponent,
            canActivate: [NgxPermissionsGuard],
            data: {
                permissions: {
                    only: ['task.printing.manager'],
                    redirectTo: '/access-denied'
                },
                title: 'Edit Category',
                breadcrumb: [
                  {label: 'Dashboard',url: '/'},
                  {label: 'Task Manager',url: '/setting/tasks'},
                  {label: 'Categories',url: '/setting/tasks/category'},
                  {label: 'Edit Category',url: ''},
                ]
            },
        },

      { path: 'setting/tasks/status',
          component: StatusComponent,
          canActivate: [NgxPermissionsGuard],
          data: {
              permissions: {
                  only: ['task.status.create', 'task.status.edit', 'task.status.delete'],
                  redirectTo: '/access-denied'
              },
            title: 'status',
            breadcrumb: [
              {label: 'Dashboard',url: '/'},
              {label: 'Task Manager',url: '/setting/tasks'},
              {label: 'status',url: ''},
            ]
        },
      },
              { path: 'setting/tasks/status/add',
                  component: AddStatusComponent,
                  canActivate: [NgxPermissionsGuard],
                  data: {
                      permissions: {
                          only: ['task.status.create'],
                          redirectTo: '/access-denied'
                      },
                    title: 'Create status',
                    breadcrumb: [
                      {label: 'Dashboard',url: '/'},
                      {label: 'Task Manager',url: '/setting/tasks'},
                      {label: 'Status',url: '/setting/tasks/status'},
                      {label: 'Create status',url: ''},
                    ]
                },
              },
              { path: 'setting/tasks/status/edit/:id',
                  component: EditStatusComponent,
                  canActivate: [NgxPermissionsGuard],
                  data: {
                      permissions: {
                          only: ['task.status.edit'],
                          redirectTo: '/access-denied'
                      },
                    title: 'Edit status',
                    breadcrumb: [
                      {label: 'Dashboard',url: '/'},
                      {label: 'Task Manager',url: '/setting/tasks'},
                      {label: 'Status',url: '/setting/tasks/status'},
                      {label: 'Edit status',url: ''},
                    ]
                },
              },

      { path: 'setting/tasks/priority',
          component: PriorityComponent,
          data: {
            title: 'Priority',
            breadcrumb: [
              {label: 'Dashboard',url: '/'},
              {label: 'Task Manager',url: '/setting/tasks'},
              {label: 'Priority',url: ''},
            ]
        },
      },
            { path: 'setting/tasks/priority/add',
                  component: AddPriorityComponent,
                  data: {
                    title: 'Create Priority',
                    breadcrumb: [
                      {label: 'Dashboard',url: '/'},
                      {label: 'Task Manager',url: '/setting/tasks'},
                      {label: 'Priority',url: '/setting/tasks/priority'},
                      {label: 'Create Priority',url: ''},
                    ]
                },
              },
              { path: 'setting/tasks/priority/edit/:id',
                  component: EditPriorityComponent,
                  data: {
                    title: 'Edit Priority',
                    breadcrumb: [
                      {label: 'Dashboard',url: '/'},
                      {label: 'Task Manager',url: '/setting/tasks'},
                      {label: 'Status',url: '/setting/tasks/priority'},
                      {label: 'Edit Priority',url: ''},
                    ]
                },
              },
      { path: 'setting/tasks/marketing',
          component: MarketingComponent,
          data: {
            title: 'Marketing',
            breadcrumb: [
              {label: 'Dashboard',url: '/'},
              {label: 'Task Manager',url: '/setting/tasks'},
              {label: 'Marketing',url: ''},
            ]
        },
      },
              { path: 'setting/tasks/marketing/add',
                    component: AddMarketingComponent,
                    data: {
                      title: 'Create Marketing',
                      breadcrumb: [
                        {label: 'Dashboard',url: '/'},
                        {label: 'Task Manager',url: '/setting/tasks'},
                        {label: 'Marketing',url: '/setting/tasks/marketing'},
                        {label: 'Create Marketing',url: ''},
                      ]
                  },
                },
                { path: 'setting/tasks/marketing/edit/:id',
                    component: EditMarketingComponent,
                    data: {
                      title: 'Edit Marketing',
                      breadcrumb: [
                        {label: 'Dashboard',url: '/'},
                        {label: 'Task Manager',url: '/setting/tasks'},
                        {label: 'Marketing',url: '/setting/tasks/marketing'},
                        {label: 'Edit Marketing',url: ''},
                      ]
                  },
                },
      { path: 'setting/tasks/printing',
          component: PrintingComponent,
          canActivate: [NgxPermissionsGuard],
          data: {
              permissions: {
                  only: ['task.printing.manager'],
                  redirectTo: '/access-denied'
              },
            title: 'Printing',
            breadcrumb: [
              {label: 'Dashboard',url: '/'},
              {label: 'Task Manager',url: '/setting/tasks'},
              {label: 'Printing',url: ''},
            ]
        },
      },
          { path: 'setting/tasks/printing/add',
                    component: AddPrintingComponent,
              canActivate: [NgxPermissionsGuard],
              data: {
                  permissions: {
                      only: ['task.printing.manager'],
                      redirectTo: '/access-denied'
                  },
                      title: 'Create Printing',
                      breadcrumb: [
                        {label: 'Dashboard',url: '/'},
                        {label: 'Task Manager',url: '/setting/tasks'},
                        {label: 'Printing',url: '/setting/tasks/printing'},
                        {label: 'Create Printing',url: ''},
                      ]
                  },
                },
                { path: 'setting/tasks/printing/edit/:id',
                    component: EditPrintingComponent,
                    canActivate: [NgxPermissionsGuard],
                    data: {
                        permissions: {
                            only: ['task.printing.manager'],
                            redirectTo: '/access-denied'
                        },
                      title: 'Edit Printing',
                      breadcrumb: [
                        {label: 'Dashboard',url: '/'},
                        {label: 'Task Manager',url: '/setting/tasks'},
                        {label: 'Printing',url: '/setting/tasks/printing'},
                        {label: 'Edit Printing',url: ''},
                      ]
                  },
                },

      // Site Setting
      { path: 'setting/site-settings',
          component: SiteSettingsComponent,
          data: {
            title: 'Site Setting',
            breadcrumb: [
              {label: 'Dashboard',url: '/'},
              {label: 'Site Setting',url: '/setting/site-settings'},
              {label: 'Site Setting',url: ''},
            ]
        },
      },
      { path: 'site-settings/license',
          component: LicenseComponent,
          data: {
            title: 'License',
            breadcrumb: [
              {label: 'Dashboard',url: '/'},
              {label: 'Site Setting',url: '/setting/site-settings'},
              {label: 'License',url: ''},
            ]
        },
      },
      { path: 'site-settings/software',
          component: SoftwareComponent,
          data: {
            title: 'Software',
            breadcrumb: [
              {label: 'Dashboard',url: '/'},
              {label: 'Site Setting',url: '/setting/site-settings'},
              {label: 'Software',url: ''},
           ]
        },
      },
      { path: 'site-settings/payment',
          component: PaymentComponent,
          data: {
            title: 'Payment',
            breadcrumb: [
              {label: 'Dashboard',url: '/'},
              {label: 'Site Setting',url: '/setting/site-settings'},
              {label: 'Payment',url: ''},
           ]
        },
      },
    ]
  },

  {
    path: '',
    component: BlankComponent,
    canActivate: [BeforeLoginService],
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'forgetpassword',
        component: ForgetpasswordComponent
      },
      {
        path: 'reset/password/:token',
        component: ResetpasswordComponent
      },
      { path: '**', redirectTo: '/login' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

  constructor(private router: Router) {
        this.router.events.subscribe((event: Event) => {
             $(document).ready(function(){
                  var menu      = $(".ic-tools-tab");
                  var indicator = $('<span class="indicator"></span>');
                    menu.prepend(indicator);
                    position_indicator(menu.find(" li.nav-item > a.nav-link.active "));
                    setTimeout(function(){indicator.css("opacity", 1);}, 500);
                    menu.find(" > li").mouseenter(function(){
                    position_indicator($(this));
                    });
                    menu.find(" > li").mouseleave(function(){
                      position_indicator(menu.find(" > li > a.active"));
                    });
                    function position_indicator(ele){
                    if(undefined === ele.position())  {return;}
                    var top = ele.position().top - 0;
                    indicator.stop().animate({
                      top: top
                     });
                  }
              });
        });
   }

}
