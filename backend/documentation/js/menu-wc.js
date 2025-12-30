'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">backend documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                                <li class="link">
                                    <a href="overview.html" data-type="chapter-link">
                                        <span class="icon ion-ios-keypad"></span>Overview
                                    </a>
                                </li>

                            <li class="link">
                                <a href="index.html" data-type="chapter-link">
                                    <span class="icon ion-ios-paper"></span>
                                        README
                                </a>
                            </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>

                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/ApartmentModule.html" data-type="entity-link" >ApartmentModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ApartmentModule-428e13ef6c0713176119ef39ab65965cf59c676337acd0756c4a849dcae76eecec0ca9218c5faf5e256c27097e3d9d50f058ad6f29f7a4b0d18c35b475390c67"' : 'data-bs-target="#xs-controllers-links-module-ApartmentModule-428e13ef6c0713176119ef39ab65965cf59c676337acd0756c4a849dcae76eecec0ca9218c5faf5e256c27097e3d9d50f058ad6f29f7a4b0d18c35b475390c67"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ApartmentModule-428e13ef6c0713176119ef39ab65965cf59c676337acd0756c4a849dcae76eecec0ca9218c5faf5e256c27097e3d9d50f058ad6f29f7a4b0d18c35b475390c67"' :
                                            'id="xs-controllers-links-module-ApartmentModule-428e13ef6c0713176119ef39ab65965cf59c676337acd0756c4a849dcae76eecec0ca9218c5faf5e256c27097e3d9d50f058ad6f29f7a4b0d18c35b475390c67"' }>
                                            <li class="link">
                                                <a href="controllers/ApartmentController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ApartmentController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ApartmentModule-428e13ef6c0713176119ef39ab65965cf59c676337acd0756c4a849dcae76eecec0ca9218c5faf5e256c27097e3d9d50f058ad6f29f7a4b0d18c35b475390c67"' : 'data-bs-target="#xs-injectables-links-module-ApartmentModule-428e13ef6c0713176119ef39ab65965cf59c676337acd0756c4a849dcae76eecec0ca9218c5faf5e256c27097e3d9d50f058ad6f29f7a4b0d18c35b475390c67"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ApartmentModule-428e13ef6c0713176119ef39ab65965cf59c676337acd0756c4a849dcae76eecec0ca9218c5faf5e256c27097e3d9d50f058ad6f29f7a4b0d18c35b475390c67"' :
                                        'id="xs-injectables-links-module-ApartmentModule-428e13ef6c0713176119ef39ab65965cf59c676337acd0756c4a849dcae76eecec0ca9218c5faf5e256c27097e3d9d50f058ad6f29f7a4b0d18c35b475390c67"' }>
                                        <li class="link">
                                            <a href="injectables/ApartmentService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ApartmentService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AppModule-710d493870004361398c26236bca1e568bf0974e03189c7ceb37a34fd7a888786e7ccd699f2d8bb90ea1eae86d50d60ffc436a64170dc54d24aa3477dbb09340"' : 'data-bs-target="#xs-controllers-links-module-AppModule-710d493870004361398c26236bca1e568bf0974e03189c7ceb37a34fd7a888786e7ccd699f2d8bb90ea1eae86d50d60ffc436a64170dc54d24aa3477dbb09340"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-710d493870004361398c26236bca1e568bf0974e03189c7ceb37a34fd7a888786e7ccd699f2d8bb90ea1eae86d50d60ffc436a64170dc54d24aa3477dbb09340"' :
                                            'id="xs-controllers-links-module-AppModule-710d493870004361398c26236bca1e568bf0974e03189c7ceb37a34fd7a888786e7ccd699f2d8bb90ea1eae86d50d60ffc436a64170dc54d24aa3477dbb09340"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-710d493870004361398c26236bca1e568bf0974e03189c7ceb37a34fd7a888786e7ccd699f2d8bb90ea1eae86d50d60ffc436a64170dc54d24aa3477dbb09340"' : 'data-bs-target="#xs-injectables-links-module-AppModule-710d493870004361398c26236bca1e568bf0974e03189c7ceb37a34fd7a888786e7ccd699f2d8bb90ea1eae86d50d60ffc436a64170dc54d24aa3477dbb09340"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-710d493870004361398c26236bca1e568bf0974e03189c7ceb37a34fd7a888786e7ccd699f2d8bb90ea1eae86d50d60ffc436a64170dc54d24aa3477dbb09340"' :
                                        'id="xs-injectables-links-module-AppModule-710d493870004361398c26236bca1e568bf0974e03189c7ceb37a34fd7a888786e7ccd699f2d8bb90ea1eae86d50d60ffc436a64170dc54d24aa3477dbb09340"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AuthModule-30d5afaaa42ad6714a5cc83ac2d986e69d37db257d41e68827821206a9b97e8b260d808db9c922585d72b2d1aded3413fc3842996d5cfee75539a2bf79abf37c"' : 'data-bs-target="#xs-controllers-links-module-AuthModule-30d5afaaa42ad6714a5cc83ac2d986e69d37db257d41e68827821206a9b97e8b260d808db9c922585d72b2d1aded3413fc3842996d5cfee75539a2bf79abf37c"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-30d5afaaa42ad6714a5cc83ac2d986e69d37db257d41e68827821206a9b97e8b260d808db9c922585d72b2d1aded3413fc3842996d5cfee75539a2bf79abf37c"' :
                                            'id="xs-controllers-links-module-AuthModule-30d5afaaa42ad6714a5cc83ac2d986e69d37db257d41e68827821206a9b97e8b260d808db9c922585d72b2d1aded3413fc3842996d5cfee75539a2bf79abf37c"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthModule-30d5afaaa42ad6714a5cc83ac2d986e69d37db257d41e68827821206a9b97e8b260d808db9c922585d72b2d1aded3413fc3842996d5cfee75539a2bf79abf37c"' : 'data-bs-target="#xs-injectables-links-module-AuthModule-30d5afaaa42ad6714a5cc83ac2d986e69d37db257d41e68827821206a9b97e8b260d808db9c922585d72b2d1aded3413fc3842996d5cfee75539a2bf79abf37c"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-30d5afaaa42ad6714a5cc83ac2d986e69d37db257d41e68827821206a9b97e8b260d808db9c922585d72b2d1aded3413fc3842996d5cfee75539a2bf79abf37c"' :
                                        'id="xs-injectables-links-module-AuthModule-30d5afaaa42ad6714a5cc83ac2d986e69d37db257d41e68827821206a9b97e8b260d808db9c922585d72b2d1aded3413fc3842996d5cfee75539a2bf79abf37c"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtStrategy</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ComplainModule.html" data-type="entity-link" >ComplainModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ComplainModule-94c82ce52d11b6fc80ebd0bb4f55a4408540b0a5f8c45284e034d83828eb993e920ec0ee01d3b05cba9778bfd367eea16f94c63d20133a56a7c89680c113f98b"' : 'data-bs-target="#xs-controllers-links-module-ComplainModule-94c82ce52d11b6fc80ebd0bb4f55a4408540b0a5f8c45284e034d83828eb993e920ec0ee01d3b05cba9778bfd367eea16f94c63d20133a56a7c89680c113f98b"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ComplainModule-94c82ce52d11b6fc80ebd0bb4f55a4408540b0a5f8c45284e034d83828eb993e920ec0ee01d3b05cba9778bfd367eea16f94c63d20133a56a7c89680c113f98b"' :
                                            'id="xs-controllers-links-module-ComplainModule-94c82ce52d11b6fc80ebd0bb4f55a4408540b0a5f8c45284e034d83828eb993e920ec0ee01d3b05cba9778bfd367eea16f94c63d20133a56a7c89680c113f98b"' }>
                                            <li class="link">
                                                <a href="controllers/ComplainController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ComplainController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ComplainModule-94c82ce52d11b6fc80ebd0bb4f55a4408540b0a5f8c45284e034d83828eb993e920ec0ee01d3b05cba9778bfd367eea16f94c63d20133a56a7c89680c113f98b"' : 'data-bs-target="#xs-injectables-links-module-ComplainModule-94c82ce52d11b6fc80ebd0bb4f55a4408540b0a5f8c45284e034d83828eb993e920ec0ee01d3b05cba9778bfd367eea16f94c63d20133a56a7c89680c113f98b"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ComplainModule-94c82ce52d11b6fc80ebd0bb4f55a4408540b0a5f8c45284e034d83828eb993e920ec0ee01d3b05cba9778bfd367eea16f94c63d20133a56a7c89680c113f98b"' :
                                        'id="xs-injectables-links-module-ComplainModule-94c82ce52d11b6fc80ebd0bb4f55a4408540b0a5f8c45284e034d83828eb993e920ec0ee01d3b05cba9778bfd367eea16f94c63d20133a56a7c89680c113f98b"' }>
                                        <li class="link">
                                            <a href="injectables/ComplainService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ComplainService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/InvoiceModule.html" data-type="entity-link" >InvoiceModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-InvoiceModule-04969911426ad38585eedcd4f9782e6ef0b6ca1f6755f705f1afe9dea4a78c4bcfd88a35f74ff8d51dd137af2800e1e441d2b478bbdae65040a175d531535cc0"' : 'data-bs-target="#xs-controllers-links-module-InvoiceModule-04969911426ad38585eedcd4f9782e6ef0b6ca1f6755f705f1afe9dea4a78c4bcfd88a35f74ff8d51dd137af2800e1e441d2b478bbdae65040a175d531535cc0"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-InvoiceModule-04969911426ad38585eedcd4f9782e6ef0b6ca1f6755f705f1afe9dea4a78c4bcfd88a35f74ff8d51dd137af2800e1e441d2b478bbdae65040a175d531535cc0"' :
                                            'id="xs-controllers-links-module-InvoiceModule-04969911426ad38585eedcd4f9782e6ef0b6ca1f6755f705f1afe9dea4a78c4bcfd88a35f74ff8d51dd137af2800e1e441d2b478bbdae65040a175d531535cc0"' }>
                                            <li class="link">
                                                <a href="controllers/InvoiceController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >InvoiceController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-InvoiceModule-04969911426ad38585eedcd4f9782e6ef0b6ca1f6755f705f1afe9dea4a78c4bcfd88a35f74ff8d51dd137af2800e1e441d2b478bbdae65040a175d531535cc0"' : 'data-bs-target="#xs-injectables-links-module-InvoiceModule-04969911426ad38585eedcd4f9782e6ef0b6ca1f6755f705f1afe9dea4a78c4bcfd88a35f74ff8d51dd137af2800e1e441d2b478bbdae65040a175d531535cc0"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-InvoiceModule-04969911426ad38585eedcd4f9782e6ef0b6ca1f6755f705f1afe9dea4a78c4bcfd88a35f74ff8d51dd137af2800e1e441d2b478bbdae65040a175d531535cc0"' :
                                        'id="xs-injectables-links-module-InvoiceModule-04969911426ad38585eedcd4f9782e6ef0b6ca1f6755f705f1afe9dea4a78c4bcfd88a35f74ff8d51dd137af2800e1e441d2b478bbdae65040a175d531535cc0"' }>
                                        <li class="link">
                                            <a href="injectables/InvoiceService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >InvoiceService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/NotificationModule.html" data-type="entity-link" >NotificationModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-NotificationModule-31165075918e411e1dacd4242676ad7b4d70dc8ca585068d4147e42bccb22fdab5aa067425ba0e7c0cb214cf2b548e6607e85c50281e14bb0e2c216f26fbccdc"' : 'data-bs-target="#xs-controllers-links-module-NotificationModule-31165075918e411e1dacd4242676ad7b4d70dc8ca585068d4147e42bccb22fdab5aa067425ba0e7c0cb214cf2b548e6607e85c50281e14bb0e2c216f26fbccdc"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-NotificationModule-31165075918e411e1dacd4242676ad7b4d70dc8ca585068d4147e42bccb22fdab5aa067425ba0e7c0cb214cf2b548e6607e85c50281e14bb0e2c216f26fbccdc"' :
                                            'id="xs-controllers-links-module-NotificationModule-31165075918e411e1dacd4242676ad7b4d70dc8ca585068d4147e42bccb22fdab5aa067425ba0e7c0cb214cf2b548e6607e85c50281e14bb0e2c216f26fbccdc"' }>
                                            <li class="link">
                                                <a href="controllers/NotificationController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NotificationController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-NotificationModule-31165075918e411e1dacd4242676ad7b4d70dc8ca585068d4147e42bccb22fdab5aa067425ba0e7c0cb214cf2b548e6607e85c50281e14bb0e2c216f26fbccdc"' : 'data-bs-target="#xs-injectables-links-module-NotificationModule-31165075918e411e1dacd4242676ad7b4d70dc8ca585068d4147e42bccb22fdab5aa067425ba0e7c0cb214cf2b548e6607e85c50281e14bb0e2c216f26fbccdc"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-NotificationModule-31165075918e411e1dacd4242676ad7b4d70dc8ca585068d4147e42bccb22fdab5aa067425ba0e7c0cb214cf2b548e6607e85c50281e14bb0e2c216f26fbccdc"' :
                                        'id="xs-injectables-links-module-NotificationModule-31165075918e411e1dacd4242676ad7b4d70dc8ca585068d4147e42bccb22fdab5aa067425ba0e7c0cb214cf2b548e6607e85c50281e14bb0e2c216f26fbccdc"' }>
                                        <li class="link">
                                            <a href="injectables/NotificationService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NotificationService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/PrismaModule.html" data-type="entity-link" >PrismaModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-PrismaModule-8a45c52f5bc506f9fcef1f4c7b34e596b06323bae0951c4fe354cc2b76489f6abcf1207439120a4bd3a6cf40174b139cda70f7a558a3f53d9bcdd3a9e74b81bf"' : 'data-bs-target="#xs-injectables-links-module-PrismaModule-8a45c52f5bc506f9fcef1f4c7b34e596b06323bae0951c4fe354cc2b76489f6abcf1207439120a4bd3a6cf40174b139cda70f7a558a3f53d9bcdd3a9e74b81bf"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-PrismaModule-8a45c52f5bc506f9fcef1f4c7b34e596b06323bae0951c4fe354cc2b76489f6abcf1207439120a4bd3a6cf40174b139cda70f7a558a3f53d9bcdd3a9e74b81bf"' :
                                        'id="xs-injectables-links-module-PrismaModule-8a45c52f5bc506f9fcef1f4c7b34e596b06323bae0951c4fe354cc2b76489f6abcf1207439120a4bd3a6cf40174b139cda70f7a558a3f53d9bcdd3a9e74b81bf"' }>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ResidentModule.html" data-type="entity-link" >ResidentModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ResidentModule-91c5d9268c10d5d08143fb65e9c4c0d28621463eebb89a3eba4948ee32cc5ee6ab957a83de0dfb5a538a94ab3940072694db5a88db3f3bc60f51aff44365650a"' : 'data-bs-target="#xs-controllers-links-module-ResidentModule-91c5d9268c10d5d08143fb65e9c4c0d28621463eebb89a3eba4948ee32cc5ee6ab957a83de0dfb5a538a94ab3940072694db5a88db3f3bc60f51aff44365650a"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ResidentModule-91c5d9268c10d5d08143fb65e9c4c0d28621463eebb89a3eba4948ee32cc5ee6ab957a83de0dfb5a538a94ab3940072694db5a88db3f3bc60f51aff44365650a"' :
                                            'id="xs-controllers-links-module-ResidentModule-91c5d9268c10d5d08143fb65e9c4c0d28621463eebb89a3eba4948ee32cc5ee6ab957a83de0dfb5a538a94ab3940072694db5a88db3f3bc60f51aff44365650a"' }>
                                            <li class="link">
                                                <a href="controllers/ResidentController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResidentController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ResidentModule-91c5d9268c10d5d08143fb65e9c4c0d28621463eebb89a3eba4948ee32cc5ee6ab957a83de0dfb5a538a94ab3940072694db5a88db3f3bc60f51aff44365650a"' : 'data-bs-target="#xs-injectables-links-module-ResidentModule-91c5d9268c10d5d08143fb65e9c4c0d28621463eebb89a3eba4948ee32cc5ee6ab957a83de0dfb5a538a94ab3940072694db5a88db3f3bc60f51aff44365650a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ResidentModule-91c5d9268c10d5d08143fb65e9c4c0d28621463eebb89a3eba4948ee32cc5ee6ab957a83de0dfb5a538a94ab3940072694db5a88db3f3bc60f51aff44365650a"' :
                                        'id="xs-injectables-links-module-ResidentModule-91c5d9268c10d5d08143fb65e9c4c0d28621463eebb89a3eba4948ee32cc5ee6ab957a83de0dfb5a538a94ab3940072694db5a88db3f3bc60f51aff44365650a"' }>
                                        <li class="link">
                                            <a href="injectables/ResidentService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResidentService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ResidentnotificationModule.html" data-type="entity-link" >ResidentnotificationModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ResidentnotificationModule-4ccf1435d35f31c762f3e7131659a4188ed681b238bf9593abbb7ca96a36e4e9d7f754ec4df651d659fb5ac2a70d5fdac0c35910eaf3a2c9723e8756078ec488"' : 'data-bs-target="#xs-controllers-links-module-ResidentnotificationModule-4ccf1435d35f31c762f3e7131659a4188ed681b238bf9593abbb7ca96a36e4e9d7f754ec4df651d659fb5ac2a70d5fdac0c35910eaf3a2c9723e8756078ec488"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ResidentnotificationModule-4ccf1435d35f31c762f3e7131659a4188ed681b238bf9593abbb7ca96a36e4e9d7f754ec4df651d659fb5ac2a70d5fdac0c35910eaf3a2c9723e8756078ec488"' :
                                            'id="xs-controllers-links-module-ResidentnotificationModule-4ccf1435d35f31c762f3e7131659a4188ed681b238bf9593abbb7ca96a36e4e9d7f754ec4df651d659fb5ac2a70d5fdac0c35910eaf3a2c9723e8756078ec488"' }>
                                            <li class="link">
                                                <a href="controllers/ResidentnotificationController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResidentnotificationController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ResidentnotificationModule-4ccf1435d35f31c762f3e7131659a4188ed681b238bf9593abbb7ca96a36e4e9d7f754ec4df651d659fb5ac2a70d5fdac0c35910eaf3a2c9723e8756078ec488"' : 'data-bs-target="#xs-injectables-links-module-ResidentnotificationModule-4ccf1435d35f31c762f3e7131659a4188ed681b238bf9593abbb7ca96a36e4e9d7f754ec4df651d659fb5ac2a70d5fdac0c35910eaf3a2c9723e8756078ec488"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ResidentnotificationModule-4ccf1435d35f31c762f3e7131659a4188ed681b238bf9593abbb7ca96a36e4e9d7f754ec4df651d659fb5ac2a70d5fdac0c35910eaf3a2c9723e8756078ec488"' :
                                        'id="xs-injectables-links-module-ResidentnotificationModule-4ccf1435d35f31c762f3e7131659a4188ed681b238bf9593abbb7ca96a36e4e9d7f754ec4df651d659fb5ac2a70d5fdac0c35910eaf3a2c9723e8756078ec488"' }>
                                        <li class="link">
                                            <a href="injectables/ResidentnotificationService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResidentnotificationService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ServiceModule.html" data-type="entity-link" >ServiceModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ServiceModule-3e51ab263da6afdb7cdb83cda71724879fea1369b46d229331aa17047baa99f676c359405b4532363ad6b6cfa73ebf9ebb6936c604b2fa110a65e8ac9af8c3db"' : 'data-bs-target="#xs-controllers-links-module-ServiceModule-3e51ab263da6afdb7cdb83cda71724879fea1369b46d229331aa17047baa99f676c359405b4532363ad6b6cfa73ebf9ebb6936c604b2fa110a65e8ac9af8c3db"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ServiceModule-3e51ab263da6afdb7cdb83cda71724879fea1369b46d229331aa17047baa99f676c359405b4532363ad6b6cfa73ebf9ebb6936c604b2fa110a65e8ac9af8c3db"' :
                                            'id="xs-controllers-links-module-ServiceModule-3e51ab263da6afdb7cdb83cda71724879fea1369b46d229331aa17047baa99f676c359405b4532363ad6b6cfa73ebf9ebb6936c604b2fa110a65e8ac9af8c3db"' }>
                                            <li class="link">
                                                <a href="controllers/ServiceController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ServiceController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ServiceModule-3e51ab263da6afdb7cdb83cda71724879fea1369b46d229331aa17047baa99f676c359405b4532363ad6b6cfa73ebf9ebb6936c604b2fa110a65e8ac9af8c3db"' : 'data-bs-target="#xs-injectables-links-module-ServiceModule-3e51ab263da6afdb7cdb83cda71724879fea1369b46d229331aa17047baa99f676c359405b4532363ad6b6cfa73ebf9ebb6936c604b2fa110a65e8ac9af8c3db"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ServiceModule-3e51ab263da6afdb7cdb83cda71724879fea1369b46d229331aa17047baa99f676c359405b4532363ad6b6cfa73ebf9ebb6936c604b2fa110a65e8ac9af8c3db"' :
                                        'id="xs-injectables-links-module-ServiceModule-3e51ab263da6afdb7cdb83cda71724879fea1369b46d229331aa17047baa99f676c359405b4532363ad6b6cfa73ebf9ebb6936c604b2fa110a65e8ac9af8c3db"' }>
                                        <li class="link">
                                            <a href="injectables/ServiceService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ServiceService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ShiftModule.html" data-type="entity-link" >ShiftModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ShiftModule-dc1a580de57060a804d39bf040c26f5fae21ad2a1c2576614190dd101dc6c792d205526cd8582383a4227abadacfc344f587c6c4d7ff93f19dbc5fd573acab91"' : 'data-bs-target="#xs-controllers-links-module-ShiftModule-dc1a580de57060a804d39bf040c26f5fae21ad2a1c2576614190dd101dc6c792d205526cd8582383a4227abadacfc344f587c6c4d7ff93f19dbc5fd573acab91"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ShiftModule-dc1a580de57060a804d39bf040c26f5fae21ad2a1c2576614190dd101dc6c792d205526cd8582383a4227abadacfc344f587c6c4d7ff93f19dbc5fd573acab91"' :
                                            'id="xs-controllers-links-module-ShiftModule-dc1a580de57060a804d39bf040c26f5fae21ad2a1c2576614190dd101dc6c792d205526cd8582383a4227abadacfc344f587c6c4d7ff93f19dbc5fd573acab91"' }>
                                            <li class="link">
                                                <a href="controllers/ShiftController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ShiftController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ShiftModule-dc1a580de57060a804d39bf040c26f5fae21ad2a1c2576614190dd101dc6c792d205526cd8582383a4227abadacfc344f587c6c4d7ff93f19dbc5fd573acab91"' : 'data-bs-target="#xs-injectables-links-module-ShiftModule-dc1a580de57060a804d39bf040c26f5fae21ad2a1c2576614190dd101dc6c792d205526cd8582383a4227abadacfc344f587c6c4d7ff93f19dbc5fd573acab91"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ShiftModule-dc1a580de57060a804d39bf040c26f5fae21ad2a1c2576614190dd101dc6c792d205526cd8582383a4227abadacfc344f587c6c4d7ff93f19dbc5fd573acab91"' :
                                        'id="xs-injectables-links-module-ShiftModule-dc1a580de57060a804d39bf040c26f5fae21ad2a1c2576614190dd101dc6c792d205526cd8582383a4227abadacfc344f587c6c4d7ff93f19dbc5fd573acab91"' }>
                                        <li class="link">
                                            <a href="injectables/ShiftService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ShiftService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/TemplatePlaygroundModule.html" data-type="entity-link" >TemplatePlaygroundModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-TemplatePlaygroundModule-a48e698b66bad8be9ff3b78b5db8e15ee6bb54bd2575fdb1bb61a34e76437cc54b2e161854c3d6c97b4c751d05ff3a43b70b87ceffd46d3c5bf53f6f161e3044"' : 'data-bs-target="#xs-components-links-module-TemplatePlaygroundModule-a48e698b66bad8be9ff3b78b5db8e15ee6bb54bd2575fdb1bb61a34e76437cc54b2e161854c3d6c97b4c751d05ff3a43b70b87ceffd46d3c5bf53f6f161e3044"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-TemplatePlaygroundModule-a48e698b66bad8be9ff3b78b5db8e15ee6bb54bd2575fdb1bb61a34e76437cc54b2e161854c3d6c97b4c751d05ff3a43b70b87ceffd46d3c5bf53f6f161e3044"' :
                                            'id="xs-components-links-module-TemplatePlaygroundModule-a48e698b66bad8be9ff3b78b5db8e15ee6bb54bd2575fdb1bb61a34e76437cc54b2e161854c3d6c97b4c751d05ff3a43b70b87ceffd46d3c5bf53f6f161e3044"' }>
                                            <li class="link">
                                                <a href="components/TemplatePlaygroundComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TemplatePlaygroundComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-TemplatePlaygroundModule-a48e698b66bad8be9ff3b78b5db8e15ee6bb54bd2575fdb1bb61a34e76437cc54b2e161854c3d6c97b4c751d05ff3a43b70b87ceffd46d3c5bf53f6f161e3044"' : 'data-bs-target="#xs-injectables-links-module-TemplatePlaygroundModule-a48e698b66bad8be9ff3b78b5db8e15ee6bb54bd2575fdb1bb61a34e76437cc54b2e161854c3d6c97b4c751d05ff3a43b70b87ceffd46d3c5bf53f6f161e3044"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-TemplatePlaygroundModule-a48e698b66bad8be9ff3b78b5db8e15ee6bb54bd2575fdb1bb61a34e76437cc54b2e161854c3d6c97b4c751d05ff3a43b70b87ceffd46d3c5bf53f6f161e3044"' :
                                        'id="xs-injectables-links-module-TemplatePlaygroundModule-a48e698b66bad8be9ff3b78b5db8e15ee6bb54bd2575fdb1bb61a34e76437cc54b2e161854c3d6c97b4c751d05ff3a43b70b87ceffd46d3c5bf53f6f161e3044"' }>
                                        <li class="link">
                                            <a href="injectables/HbsRenderService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HbsRenderService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/TemplateEditorService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TemplateEditorService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ZipExportService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ZipExportService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#controllers-links"' :
                                'data-bs-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/ApartmentController.html" data-type="entity-link" >ApartmentController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/AppController.html" data-type="entity-link" >AppController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/AuthController.html" data-type="entity-link" >AuthController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ComplainController.html" data-type="entity-link" >ComplainController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/InvoiceController.html" data-type="entity-link" >InvoiceController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/NotificationController.html" data-type="entity-link" >NotificationController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ResidentController.html" data-type="entity-link" >ResidentController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ResidentnotificationController.html" data-type="entity-link" >ResidentnotificationController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ServiceController.html" data-type="entity-link" >ServiceController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ShiftController.html" data-type="entity-link" >ShiftController</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/CreateApartmentDto.html" data-type="entity-link" >CreateApartmentDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateComplainDto.html" data-type="entity-link" >CreateComplainDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateInvoiceDto.html" data-type="entity-link" >CreateInvoiceDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateNotificationDto.html" data-type="entity-link" >CreateNotificationDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateResidentDto.html" data-type="entity-link" >CreateResidentDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateServiceDto.html" data-type="entity-link" >CreateServiceDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateShiftDto.html" data-type="entity-link" >CreateShiftDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ForgotPasswordDto.html" data-type="entity-link" >ForgotPasswordDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetNotificationsByResidentDto.html" data-type="entity-link" >GetNotificationsByResidentDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetResidentsByNotificationDto.html" data-type="entity-link" >GetResidentsByNotificationDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/InvoiceResponseDto.html" data-type="entity-link" >InvoiceResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginDto.html" data-type="entity-link" >LoginDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProfileResponseDto.html" data-type="entity-link" >ProfileResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ShiftResponseDto.html" data-type="entity-link" >ShiftResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateApartmentDto.html" data-type="entity-link" >UpdateApartmentDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateComplainDto.html" data-type="entity-link" >UpdateComplainDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateInvoiceDto.html" data-type="entity-link" >UpdateInvoiceDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateNotificationDto.html" data-type="entity-link" >UpdateNotificationDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateResidentDto.html" data-type="entity-link" >UpdateResidentDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateServiceDto.html" data-type="entity-link" >UpdateServiceDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateShiftDto.html" data-type="entity-link" >UpdateShiftDto</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/ApartmentService.html" data-type="entity-link" >ApartmentService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AppService.html" data-type="entity-link" >AppService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ComplainService.html" data-type="entity-link" >ComplainService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/HbsRenderService.html" data-type="entity-link" >HbsRenderService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/InvoiceService.html" data-type="entity-link" >InvoiceService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtAuthGuard.html" data-type="entity-link" >JwtAuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtStrategy.html" data-type="entity-link" >JwtStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NotificationService.html" data-type="entity-link" >NotificationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PrismaService.html" data-type="entity-link" >PrismaService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ResidentnotificationService.html" data-type="entity-link" >ResidentnotificationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ResidentService.html" data-type="entity-link" >ResidentService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ServiceService.html" data-type="entity-link" >ServiceService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ShiftService.html" data-type="entity-link" >ShiftService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TemplateEditorService.html" data-type="entity-link" >TemplateEditorService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ZipExportService.html" data-type="entity-link" >ZipExportService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/RolesGuard.html" data-type="entity-link" >RolesGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/CompoDocConfig.html" data-type="entity-link" >CompoDocConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/JwtPayload.html" data-type="entity-link" >JwtPayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RequestWithUser.html" data-type="entity-link" >RequestWithUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RequestWithUser-1.html" data-type="entity-link" >RequestWithUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Session.html" data-type="entity-link" >Session</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Template.html" data-type="entity-link" >Template</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});