<!-- view point persons view -->
<div id="point-persons-view" style="display:none;" class="contact-info plain-list">
    <!-- CONTENT HERE -->
    <form>
        <input type="hidden" id="point-persons-view-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
        <div class="contact-info-details">
            <div class="section primary-info expanded">
                <div id="expand-primary" class="header">
                    <h3><b>Point Person Details</b></h3>&nbsp&nbsp
                    <a id="point-persons-view-edit-button" href="#">[Edit]</a>
                    <a id="point-persons-view-delete-button" href="#" style="float:right;">[Delete]</a>
                </div>
            </div>
            <div id="edit-primary-content" class="content">
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Name</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span class="value" id="point-persons-view-username"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">User Group</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span class="value" id="point-persons-view-usergroup"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field --> 
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Description</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span class="value" id="point-persons-view-description"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <a id="point-persons-view-back-button" href="#">[Back]</a>
            </div>
        </div>
    </form>
</div><!--END view point person-->