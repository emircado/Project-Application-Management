<!-- view contact persons view -->
<div id="view-contact-persons-view" style="display:none;" class="contact-info plain-list">
    <!-- CONTENT HERE -->
    <form>
        <input type="hidden" id="contact-persons-view-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
        <div class="contact-info-details">
            <div class="section primary-info expanded">
                <div id="expand-primary" class="header">
                    <h3><b>Contact Person Details</b></h3>&nbsp&nbsp
                    <a id="contact-persons-edit" href="#">[Edit]</a>
                    <a id="contact-persons-delete" href="#" style="float:right;">[Delete]</a>
                </div>
            </div>
            <div id="edit-primary-content" class="content">
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Name</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span class="value" id="contact-persons-view-name"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Company</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span class="value" id="contact-persons-view-company"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field --> 
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Position</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span class="value" id="contact-persons-view-position"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field --> 
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Contact Numbers</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span class="value" id="contact-persons-view-contacts"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field --> 
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Email</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span class="value" id="contact-persons-view-email"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Address</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span class="value" id="contact-persons-view-address"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field --> 
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Notes</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span class="value" id="contact-persons-view-notes"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Date Created</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span class="value" id="contact-persons-view-created"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field --> 
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Date Updated</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span class="value" id="contact-persons-view-updated"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field --> 
                <a id="contact-person-view-to-list" href="#">[Back]</a>
            </div>
        </div>
    </form>
</div><!--END view contact person-->