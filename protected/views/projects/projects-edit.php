<!-- edit part view -->
<div id="projects-edit" style="display:none;" class="contact-info plain-list">
    <!-- FORM HERE -->
    <form>
        <input type="hidden" id="projects-edit-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
        <div class="contact-info-details">
            <div class="section primary-info expanded">
                <div id="expand-primary" class="header"><h3><b>Project Details</b></h3></div>
            </div>
            <!--CONTENT for EDIT PROJECT-->
            <div id="edit-primary-content" class="content">
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Name*</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field">
                        <input type="text" id="projects-edit-name" class="text"></input>
                        <span id="projects-edit-name-error" class="field-input-name-error error-message" style="display: none;"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Code*</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field">
                        <input type="text" id="projects-edit-code" class="text"></input>
                        <span id="projects-edit-code-error" class="field-input-name-error error-message" style="display: none;"></span>
                        </div>
                        <div style="font-size:12px;padding-top:3px;"><i>(must be 5 characters long, consisting of A-Z, 0-9)</i></div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Description</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field">
                        <textarea rows="4" id="projects-edit-description" class="text"></textarea>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Production Date</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field">
                        <input type="date" id="projects-edit-production" class="text"></input>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="dialog-footer-block">
                    <div class="field field-text">
                        <div class="field-action-content">
                            <div class="pseudo-field pseudo-button">
                                <a id="projects-edit-cancel-button" class="cancel" href="#">Cancel</a>
                            </div>
                            <div class="pseudo-field pseudo-button primary-button">
                                <button id="projects-edit-save-button">Save Changes</button>
                            </div>
                        </div><!-- End Field Action Content -->
                    </div><!-- End Field Action -->
                </div><!-- End UI Dialog Footer Block -->
            </div>
            <!--END EDIT CONTENT PROJECT-->
        </div>
    </form>
</div><!--END edit user-->