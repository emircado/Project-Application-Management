<!-- create part view -->
<div id="project-notes-create" style="display:none;" class="contact-info plain-list">
    <!-- FORM HERE -->
    <form>
        <!-- CSRF TOKEN HERE -->
        <input type="hidden" id="project-notes-create-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
        <div class="contact-info-details">
            <div class="section primary-info expanded">
                <div id="expand-primary" class="header"><h3><b>Add Note</b></h3></div>
            </div>
            <!--CONTENT for CREATE PROJECT NOTES-->
            <div id="edit-primary-content" class="content">
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Notes</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field">
                        <textarea rows="8" id="project-notes-create-notes" class="text"></textarea>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="dialog-footer-block">
                    <div class="field field-text">
                        <div class="field-action-content">
                            <div class="pseudo-field pseudo-button">
                                <a id="project-notes-create-cancel-button" class="cancel" href="#">Cancel</a>
                            </div>
                            <div class="pseudo-field pseudo-button primary-button">
                                <button id="project-notes-create-save-button">Create</button>
                            </div>
                        </div><!-- End Field Action Content -->
                    </div><!-- End Field Action -->
                </div><!-- End UI Dialog Footer Block -->
            </div>
            <!--END CREATE CONTENT PROJECT NOTES-->
        </div>
    </form>
</div><!--END create Contact Person-->