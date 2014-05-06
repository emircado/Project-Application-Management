<!-- create part view -->
<div id="create-contact-persons-view" style="display:none;" class="contact-info plain-list">
    <!-- FORM HERE -->
    <form>
        <!-- CSRF TOKEN HERE -->
        <input type="hidden" id="contact-persons-create-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
        <div class="contact-info-details">
            <div class="section primary-info expanded">
                <div id="expand-primary" class="header"><h3><b>Add Contact Person</b></h3></div>
            </div>
            <!--CONTENT for CREATE PROJECT-->
            <div id="edit-primary-content" class="content">
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Name</span><span>(required)</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field">
                        <input type="text" id="contact-persons-create-name" class="text"></input>
                        <span id="contact-persons-create-name-error" class="field-input-name-error error-message" style="display: none;"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Company</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field">
                        <input type="text" id="contact-persons-create-company" class="text"></input>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Position</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field">
                        <input type="text" id="contact-persons-create-position" class="text"></input>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Email</span><span>(required)</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field">
                        <input type="text" id="contact-persons-create-email" class="text"></input>
                        <span id="contact-persons-create-email-error" class="field-input-name-error error-message" style="display: none;"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Contact Numbers</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field">
                        <input type="text" id="contact-persons-create-contacts" class="text"></input>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Address</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field">
                        <input type="text" id="contact-persons-create-address" class="text"></input>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Notes</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field">
                        <textarea rows="4" id="contact-persons-create-notes" class="text"></textarea>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="dialog-footer-block">
                    <div class="field field-text">
                        <div class="field-action-content">
                            <div class="pseudo-field pseudo-button">
                                <a id="contact-persons-create-button-cancel" class="cancel" href="#">Cancel</a>
                            </div>
                            <div class="pseudo-field pseudo-button primary-button">
                                <button id="create-button-create-contact-persons">Create</button>
                            </div>
                        </div><!-- End Field Action Content -->
                    </div><!-- End Field Action -->
                </div><!-- End UI Dialog Footer Block -->
            </div>
            <!--END CREATE CONTENT PROJECT-->
        </div>
    </form>
</div><!--END create Contact Person-->