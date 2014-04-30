<!-- view contact persons view -->
<div id="view-point-persons-view" style="display:none;" class="contact-info plain-list">
    <div class="header-block-button">
        <div class="pseudo-field back-button">
            <a id="point-person-view-to-list" href="#" title="Back to list" class="with-tool-tip"><span class="icon"></span><span class="tooltip">Back<span class="arrow icon"></span></span></a>
        </div>
    </div><br /><br />

    <!-- CONTENT HERE -->
    <form>
        <input type="hidden" id="point-persons-view-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
        <div class="contact-info-details">
            <div class="section primary-info expanded">
                <div id="expand-primary" class="header">
                    <h3><b>Point Person Details</b></h3>&nbsp&nbsp
                    <a id="point-persons-edit" href="#">[Edit]</a>
                    <a id="point-persons-delete" href="#" style="float:right;">[Delete]</a>
                </div>
            </div>
            <div id="edit-primary-content" class="content">
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Username</span></div>
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
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Date Created</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span class="value" id="point-persons-view-created"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field --> 
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Date Updated</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span class="value" id="point-persons-view-updated"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field --> 
            </div>
        </div>
    </form>
</div><!--END view point person-->