<!-- edit note view -->
<div id="app-servers-edit" class="contact-info plain-list" style="display:none;">
    <!-- CONTENT HERE -->
    <form>
        <div class="contact-info-details">
            <div class="section primary-info expanded">
                <div id="expand-primary" class="header">
                    <h3><b>Edit Application Server</b></h3>&nbsp&nbsp
                </div>
            </div>
            <div id="edit-primary-content" class="content">
                <input type="hidden" id="app-servers-edit-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Server</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span id="app-servers-edit-server" class="value"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Application Path</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field">
                        <input id="app-servers-edit-path" type="text" class="text"/>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Application Log</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field">
                        <input id="app-servers-edit-log" type="text" class="text"/>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="dialog-footer-block">
                    <div class="field field-text">
                        <div class="field-action-content">
                            <div class="pseudo-field pseudo-button">
                                <a id="app-servers-edit-cancel-button" class="cancel" href="#">Cancel</a>
                            </div>
                            <div class="pseudo-field pseudo-button primary-button">
                                <button id="app-servers-edit-save-button">Save Changes</button>
                            </div>
                        </div><!-- End Field Action Content -->
                    </div><!-- End Field Action -->
                </div><!-- End UI Dialog Footer Block -->
            </div>
        </div>
    </form>
</div><!--END edit note-->