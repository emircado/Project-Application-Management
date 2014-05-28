<!-- edit part view -->
<div id="point-persons-edit" style="display:none;" class="contact-info plain-list">
    <!-- FORM HERE -->
    <form>
        <input type="hidden" id="point-persons-edit-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
        <div class="contact-info-details">
            <div class="section primary-info expanded">
                <div id="expand-primary" class="header"><h3><b>Point Person Details</b></h3></div>
            </div>
            <!--CONTENT for EDIT POINT PERSON-->
            <div id="edit-primary-content" class="content">
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Name</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span class="value" id="point-persons-edit-username"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">User Group</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span class="value" id="point-persons-edit-usergroup"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field --> 
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Description</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field">
                        <textarea rows="4" id="point-persons-edit-description" class="text"></textarea>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="dialog-footer-block">
                    <div class="field field-text">
                        <div class="field-action-content">
                            <div class="pseudo-field pseudo-button">
                                <a id="point-persons-edit-cancel-button" class="cancel" href="#">Cancel</a>
                            </div>
                            <div class="pseudo-field pseudo-button primary-button">
                                <button id="point-persons-edit-save-button">Save Changes</button>
                            </div>
                        </div><!-- End Field Action Content -->
                    </div><!-- End Field Action -->
                </div><!-- End UI Dialog Footer Block -->
            </div>
            <!--END EDIT CONTENT POINT PERSON-->
        </div>
    </form>
</div><!--END edit user-->