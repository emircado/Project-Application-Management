<div id="app-servers-create-modal" class="dialog-box module" style="display:none;">
    <div class="dialog-container">
        <div class="dialog-content">
            <div class="dialog-header-block">
                <h3>Create a Server</h3>
                <a id="app-servers-create-modal-close-button" href="#" class="close-dialog" title="Close"><span class="icon"></span></a>
            </div>
            <div class="dialog-content-block">
                <div class="form module">
                    <!-- create application server view -->
                    <div class="contact-info plain-list">
                        <!-- CONTENT HERE -->
                        <form>
                            <input type="hidden" id="app-servers-create-modal-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
                            <div class="contact-info-details">
                                <div id="edit-primary-content" class="content">
                                    <div class="field field-input-name">
                                        <div class="field-secondary"><span class="label">Name</span></div>
                                        <div class="field-primary">
                                            <div class="pseudo-field">
                                            <input id="app-servers-create-modal-name" type="text" class="text"/>
                                            <span id="app-servers-create-modal-name-error" class="field-input-name-error error-message" style="display: none;"></span>
                                            </div>
                                        </div><!-- End Field Primary -->
                                    </div><!-- End Field -->
                                    <div class="field field-input-name">
                                        <div class="field-secondary"><span class="label">Type</span></div>
                                        <div class="field-primary" style="margin-top:8px;">
                                            <div class="pseudo-field">
                                            <span id="app-servers-create-modal-type" class="value"></span>
                                            <span id="app-servers-create-modal-type-error" class="field-input-name-error error-message" style="display: none;"></span>
                                            </div>
                                        </div><!-- End Field Primary -->
                                    </div><!-- End Field -->
                                    <div class="field field-input-name">
                                        <div class="field-secondary"><span class="label">Host</span></div>
                                        <div class="field-primary">
                                            <div class="pseudo-field">
                                            <input id="app-servers-create-modal-host" type="text" class="text"/>
                                            </div>
                                        </div><!-- End Field Primary -->
                                    </div><!-- End Field -->
                                    <div class="field field-input-name">
                                        <div class="field-secondary"><span class="label">Public IP</span></div>
                                        <div class="field-primary">
                                            <div class="pseudo-field">
                                            <input id="app-servers-create-modal-public" type="text" class="text"/>
                                            <span id="app-servers-create-modal-public-error" class="field-input-name-error error-message" style="display: none;"></span>
                                            </div>
                                            <div class="form-note"><i>(Public IP must be unique)</i></div>
                                        </div><!-- End Field Primary -->
                                    </div><!-- End Field -->
                                    <div class="field field-input-name">
                                        <div class="field-secondary"><span class="label">Private IP</span></div>
                                        <div class="field-primary">
                                            <div class="pseudo-field">
                                            <input id="app-servers-create-modal-private" type="text" class="text"/>
                                            <span id="app-servers-create-modal-private-error" class="field-input-name-error error-message" style="display: none;"></span>
                                            </div>
                                            <div class="form-note"><i>(Private IP + Network combination must be unique)</i></div>
                                        </div><!-- End Field Primary -->
                                    </div><!-- End Field -->
                                    <div class="field field-input-name">
                                        <div class="field-secondary"><span class="label">Network*</span></div>
                                        <div class="field-primary">
                                            <div class="pseudo-field">
                                            <input id="app-servers-create-modal-network" type="text" class="text"/>
                                            <span id="app-servers-create-modal-network-error" class="field-input-name-error error-message" style="display: none;"></span>
                                            </div>
                                        </div><!-- End Field Primary -->
                                    </div><!-- End Field -->
                                    <div class="field field-input-name">
                                        <div class="field-secondary"><span class="label">Location</span></div>
                                        <div class="field-primary">
                                            <div class="pseudo-field">
                                            <input id="app-servers-create-modal-location" type="text" class="text"/>
                                            </div>
                                        </div><!-- End Field Primary -->
                                    </div><!-- End Field -->
                                    <div class="field field-input-name">
                                        <div class="field-secondary"><span class="label">Description</span></div>
                                        <div class="field-primary">
                                            <div class="pseudo-field">
                                            <textarea id="app-servers-create-modal-description" rows="4" class="text"></textarea>
                                            </div>
                                        </div><!-- End Field Primary -->
                                    </div><!-- End Field -->
                                    <div class="field field-input-name">
                                        <div class="field-secondary"><span class="label">Production Date</span></div>
                                        <div class="field-primary">
                                            <div class="pseudo-field">
                                            <input id="app-servers-create-modal-production" type="text" class="text"/>
                                            </div>
                                        </div><!-- End Field Primary -->
                                    </div><!-- End Field -->
                                    <div class="field field-input-name">
                                        <div class="field-secondary"><span class="label">Termination Date</span></div>
                                        <div class="field-primary">
                                            <div class="pseudo-field">
                                            <input id="app-servers-create-modal-termination" type="text" class="text"/>
                                            </div>
                                        </div><!-- End Field Primary -->
                                    </div><!-- End Field -->
                                    <div class="dialog-footer-block">
                                        <div class="field field-text">
                                            <div class="field-action-content">
                                                <div class="pseudo-field pseudo-button">
                                                    <a id="app-servers-create-modal-cancel-button" class="cancel" href="#">Cancel</a>
                                                </div>
                                                <div class="pseudo-field pseudo-button primary-button">
                                                    <button id="app-servers-create-modal-save-button">Create</button>
                                                </div>
                                            </div><!-- End Field Action Content -->
                                        </div><!-- End Field Action -->
                                    </div><!-- End UI Dialog Footer Block -->
                                </div>
                            </div>
                        </form>
                    </div><!--END create application server-->
                </div>
            </div>
        </div>
    </div>
</div>

