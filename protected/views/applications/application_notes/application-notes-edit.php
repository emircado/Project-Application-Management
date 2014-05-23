<!-- edit part view -->
<div id="application-notes-edit" style="display:none;" class="contact-info plain-list">
    <!-- FORM HERE -->
    <form>
        <input type="hidden" id="application-notes-edit-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
        <div class="contact-info-details">
            <div class="section primary-info expanded">
                <div id="expand-primary" class="header"><h3><b>Application Note Details</b></h3></div>
            </div>
            <!--CONTENT for EDIT APPLICATION NOTE-->
            <div id="edit-primary-content" class="content">
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Notes</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field">
                        <textarea rows="8" id="application-notes-edit-notes" class="text"></textarea>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="dialog-footer-block">
                    <div class="field field-text">
                        <div class="field-action-content">
                            <div class="pseudo-field pseudo-button">
                                <a id="application-notes-edit-cancel-button" class="cancel" href="#">Cancel</a>
                            </div>
                            <div class="pseudo-field pseudo-button primary-button">
                                <button id="application-notes-edit-save-button">Save Changes</button>
                            </div>
                        </div><!-- End Field Action Content -->
                    </div><!-- End Field Action -->
                </div><!-- End UI Dialog Footer Block -->
            </div>
            <!--END EDIT CONTENT APPLICATION NOTE-->
        </div>
    </form>
</div><!--END edit user-->