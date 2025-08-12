"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const cron_service_1 = require("./cron_tab/cron.service");
const commit_dto_1 = require("./commit/dto/commit.dto");
const swagger_1 = require("@nestjs/swagger");
let AppController = class AppController {
    appService;
    cronService;
    constructor(appService, cronService) {
        this.appService = appService;
        this.cronService = cronService;
    }
    getHello() {
        return this.appService.getHello();
    }
    async triggerCommit(commitDto) {
        this.cronService.triggerCommit(commitDto);
        return 'Commit process initiated. Check logs for details.';
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Post)('commit'),
    (0, swagger_1.ApiOperation)({ summary: 'Trigger a code commit with provided repository details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Commit process initiated successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [commit_dto_1.CommitDto]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "triggerCommit", null);
exports.AppController = AppController = __decorate([
    (0, swagger_1.ApiTags)('Commit'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService,
        cron_service_1.CronService])
], AppController);
//# sourceMappingURL=app.controller.js.map