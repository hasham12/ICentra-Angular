import { ApiService } from './services/api.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPermissionsModule } from 'ngx-permissions';

// DEP
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { ColorPickerModule } from 'ngx-color-picker';
import { NgxUploaderModule } from 'ngx-uploader';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { ChartsModule } from 'ng2-charts';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { Ng7DynamicBreadcrumbModule } from "ng7-dynamic-breadcrumb";
import { MomentModule } from 'ngx-moment';
import { TimeAgoPipe } from 'time-ago-pipe';

// Routs
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Services
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { TokenService } from './services/auth/token.service';
import { AuthService } from './services/auth/auth.service';
import { AfterLoginService } from './services/auth/after-login.service';
import { BeforeLoginService } from './services/auth/before-login.service';
// User service
import { UserService } from './services/user/user.service';
// Template services
import { AppGlobals } from './components/globals';
import { CreateGlobals } from './components/templates/create/create.globals';


// Default
import { FullComponent } from './layouts/full/full.component';
import { BlankComponent } from './layouts/blank/blank.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

// Login
import { AccessDeniedComponent } from './common/access-denied/access-denied.component';
import { LoginComponent } from './components/Auth/login/login.component';
import { ForgetpasswordComponent } from './components/Auth/forgetpassword/forgetpassword.component';
// Common
import { HeaderComponent } from './common/header/header.component';
import { SidebarComponent } from './common/sidebar/sidebar.component';
import { BreadcrumbComponent } from './common/breadcrumb/breadcrumb.component';
import { SearchComponent } from './common/search/search.component';
import { ActivityStreamComponent } from './common/activity-stream/activity-stream.component';
import { FooterComponent } from './common/footer/footer.component';
import { LibraryManagerComponent } from './common/library-manager/library-manager.component';


// Template
import { DesignComponent } from './components/templates/design/design.component';
import { CreateComponent } from './components/templates/create/create.component';
import { TemplateNavComponent } from './components/templates/create/template-nav/template-nav.component';
import { TextComponent } from './components/templates/create/text/text.component';
import { BackgroundComponent } from './components/templates/create/background/background.component';
import { KitsComponent } from './components/templates/create/kits/kits.component';
import { ImagesComponent } from './components/templates/create/images/images.component';
import { IconsComponent } from './components/templates/create/icons/icons.component';
import { ShapesComponent } from './components/templates/create/shapes/shapes.component';
import { DrawComponent } from './components/templates/create/draw/draw.component';
import { ImportComponent } from './components/templates/create/import/import.component';
import { REAComponent } from './components/templates/create/rea/rea.component';
import { FieldsComponent } from './components/templates/create/fields/fields.component';
import { PagesComponent } from './components/templates/create/pages/pages.component';
import { MyDesignComponent } from './components/templates/my-design/my-design.component';
import { WebsiteComponent } from './components/templates/website/website.component';
import { PrivateComponent } from './components/templates/library/private/private.component';
import { IcentraComponent } from './components/templates/library/icentra/icentra.component';
import { ReceivedComponent } from './components/templates/library/received/received.component';
import { LibOfficeComponent } from './components/templates/library/office/office.component';
// My Tasks
import { MyTasksComponent } from './components/my-tasks/my-tasks/my-tasks.component';
import { EditTaskComponent } from './components/my-tasks/edit-task/edit-task.component';
import { ViewTaskComponent } from './components/my-tasks/view-task/view-task.component';
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
import { GeneralSettingNavComponent } from './components/setting/general/general-setting-nav/general-setting-nav.component';
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
import { RolesComponent } from './components/setting/users/roles/roles.component';
import { AddRoleComponent } from './components/setting/users/roles/add-role/add-role.component';
import { EditRoleComponent } from './components/setting/users/roles/edit-role/edit-role.component';
import { FontsComponent } from './components/setting/templates/canvas/fonts/fonts.component';
// User Level
import { UserLevelComponent } from './components/setting/users/user-level/user-level.component';
import { AddUserLevelComponent } from './components/setting/users/user-level/add-user-level/add-user-level.component';
import { EditUserLevelComponent } from './components/setting/users/user-level/edit-user-level/edit-user-level.component';

// Templates
import { SiteimagesComponent } from './components/setting/templates/images/siteimages/siteimages.component';
import { BgimagesComponent } from './components/setting/templates/images/bgimages/bgimages.component';
import { BgpatternsComponent } from './components/setting/templates/images/bgpatterns/bgpatterns.component';
import { ImportsComponent } from './components/setting/templates/images/imports/imports.component';
import { TemplatesNavComponent } from './components/setting/templates/templates-nav/templates-nav.component';
import { CanvaspagesComponent } from './components/setting/templates/canvas/pages/canvaspages.component';
import { CanvasTemplatesComponent } from './components/setting/templates/canvas/templates/canvastemplates.component';
import { VectoriconsComponent } from './components/setting/templates/vector/icons/vectoricons.component';
import { VectorshapesComponent } from './components/setting/templates/vector/shapes/vectorshapes.component';
// Templates Category
import { TemplatesComponent } from './components/setting/templates/category/templates/templates.component';
// Image Category
import { ImageComponent } from './components/setting/templates/category/image/image.component';
// Icons Category
import { IcnComponent } from './components/setting/templates/category/icons/icons.component';
// Background Category
import { BgComponent } from './components/setting/templates/category/background/background.component';
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
import { SiteSettingsNavComponent } from './components/setting/site-settings/site-settings-nav/site-settings-nav.component';
import { SiteSettingsComponent } from './components/setting/site-settings/site-settings.component';
import { LicenseComponent } from './components/setting/site-settings/license/license.component';
import { SoftwareComponent } from './components/setting/site-settings/software/software.component';
import { PaymentComponent } from './components/setting/site-settings/payment/payment.component';


// progress bar
import { NgProgressModule, NgProgressInterceptor } from 'ngx-progressbar';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { FormHelper } from './helpers/form-helper';
import { LibraryHelper } from 'src/app/helpers/library-helper';
import { ResetpasswordComponent } from './components/Auth/resetpassword/resetpassword.component';
import { DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import { DatePipe } from '@angular/common';
import { FileUploadModule } from 'ng2-file-upload';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TaskDraftComponent } from './components/my-tasks/task-draft/task-draft.component';
import { TaskBoardComponent } from './components/my-tasks/task-board/task-board.component';
import { EditTaskModelComponent } from './components/my-tasks/edit-task-model/edit-task-model.component';
import { PusherService } from './services/pusher.service';
import { LibrarySettingsComponent } from './components/setting/general/library-settings/library-settings.component';




@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        HeaderComponent,
        SidebarComponent,
        SearchComponent,
        ActivityStreamComponent,
        BreadcrumbComponent,
        FullComponent,
        BlankComponent,
        DesignComponent,
        CreateComponent,
        TextComponent,
        TemplateNavComponent,
        BackgroundComponent,
        KitsComponent,
        ImagesComponent,
        IconsComponent,
        ShapesComponent,
        DrawComponent,
        ImportComponent,
        REAComponent,
        FieldsComponent,
        PagesComponent,
        MyDesignComponent,
        WebsiteComponent,
        LibOfficeComponent,
        PrivateComponent,
        IcentraComponent,
        ReceivedComponent,
        LoginComponent,
        ForgetpasswordComponent,
        MyTasksComponent,
        AllTasksComponent,
        IncompleteComponent,
        CompleteComponent,
        InprogressComponent,
        CreateTaskComponent,
        EditTaskComponent,
        MultipleTasksComponent,
        MyReportComponent,
        AllReportsComponent,
        CreateReportComponent,
        YourProfileComponent,
        GeneralComponent,
        UsersComponent,
        AddNewUserComponent,
        EditUserComponent,
        GroupsComponent,
        AddGroupComponent,
        EditGroupComponent,
        OfficeComponent,
        AddOfficeComponent,
        EditOfficeComponent,
        PermissionsComponent,
        RolesComponent,
        AddRoleComponent,
        EditRoleComponent,
        UserLevelComponent,
        AddUserLevelComponent,
        EditUserLevelComponent,
        SiteimagesComponent,
        BgimagesComponent,
        BgpatternsComponent,
        ImportsComponent,
        TemplatesNavComponent,
        TasksManagerComponent,
        JobTypeComponent,
        AddJobTypeComponent,
        EditJobTypeComponent,
        TaskCategoryComponent,
        AddTaskCategoryComponent,
        EditTaskCategoryComponent,
        StatusComponent,
        AddStatusComponent,
        EditStatusComponent,
        PriorityComponent,
        AddPriorityComponent,
        EditPriorityComponent,
        MarketingComponent,
        AddMarketingComponent,
        EditMarketingComponent,
        PrintingComponent,
        AddPrintingComponent,
        EditPrintingComponent,
        SiteSettingsComponent,
        LicenseComponent,
        SoftwareComponent,
        PaymentComponent,
        SiteSettingsNavComponent,
        ResetpasswordComponent,
        VectoriconsComponent,
        CanvaspagesComponent,
        CanvasTemplatesComponent,
        FontsComponent,
        VectorshapesComponent,
        TemplatesComponent,
        ImageComponent,
        IcnComponent,
        BgComponent,
        FooterComponent,
        ViewTaskComponent,
        GeneralSettingNavComponent,
        TaskDraftComponent,
        TaskBoardComponent,
        AccessDeniedComponent,
        EditTaskModelComponent,
        LibraryManagerComponent,
        TimeAgoPipe,
        ViewReportComponent,
        LibrarySettingsComponent
    ],
    exports: [
        NgxPermissionsModule
    ],
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        FormsModule,
        HttpModule,
        HttpClientModule,
        AppRoutingModule,
        NgProgressModule,
        NgProgressHttpModule,
        BrowserModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
        NgSelectModule,
        SlickCarouselModule,
        ChartsModule,
        ColorPickerModule,
        DateRangePickerModule,
        FileUploadModule,
        Ng7DynamicBreadcrumbModule,
        MomentModule,
        DragDropModule,
        MalihuScrollbarModule.forRoot(),
        NgCircleProgressModule.forRoot({
            radius: 100,
            outerStrokeWidth: 16,
            innerStrokeWidth: 8,
            outerStrokeColor: "#78C000",
            innerStrokeColor: "#C7E596",
            animationDuration: 300,
        }),
        NgxPermissionsModule.forRoot(),
        NgxUploaderModule
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: NgProgressInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        // UserResolve,
        TokenService,
        AuthService,
        AfterLoginService,
        BeforeLoginService,
        UserService,
        ApiService,
        PusherService,
        FormHelper,
        LibraryHelper,
        AppGlobals,
        CreateGlobals,
        DatePipe, TimeAgoPipe
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
