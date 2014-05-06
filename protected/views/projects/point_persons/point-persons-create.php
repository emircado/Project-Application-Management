<!-- create part view -->
<div id="create-point-persons-view" style="display:none;" class="contact-info plain-list">
    <!-- FORM HERE -->
    <form>
        <input type="hidden" id="point-persons-create-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
        <div class="contact-info-details">
            <div class="section primary-info expanded">
                <div id="expand-primary" class="header"><h3><b>Add Point Person</b></h3></div>
            </div>
            <!--CONTENT for CREATE POINT PERSON-->
            <div id="edit-primary-content" class="content">
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">User Group*</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field">
                        <select class="select" id="point-persons-create-usergroup">
                        </select>
                        <span id="point-persons-create-usergroup-error" class="field-input-name-error error-message" style="display: none;"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Name*</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field">
                        <select class="select" id="point-persons-create-username">
                        </select>
                        <span id="point-persons-create-username-error" class="field-input-name-error error-message" style="display: none;"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Description</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field">
                        <textarea rows="4" id="point-persons-create-description" class="text"></textarea>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="dialog-footer-block">
                    <div class="field field-text">
                        <div class="field-action-content">
                            <div class="pseudo-field pseudo-button">
                                <a id="point-persons-create-button-cancel" class="cancel" href="#">Cancel</a>
                            </div>
                            <div class="pseudo-field pseudo-button primary-button">
                                <button id="create-button-create-point-persons">Create</button>
                            </div>
                        </div><!-- End Field Action Content -->
                    </div><!-- End Field Action -->
                </div><!-- End UI Dialog Footer Block -->
            </div>
            <!--END CREATE CONTENT POINT PERSON-->
        </div>
    </form>
</div><!--END create Contact Person