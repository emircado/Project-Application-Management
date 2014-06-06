<!-- LIST CONTACT PERSONS -->
<div id="contact-persons-list">
    <form>
        <input type="hidden" id="contact-persons-list-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
        <div class="contact-info-details">
            <!-- header -->
            <div class="section primary-info expanded">
                <div id="expand-primary" class="header">
                    <h3><b>Contact Persons</b></h3>&nbsp&nbsp
                    <a id="contact-persons-list-create-button" href="#">[Add]</a>
                </div>
            </div>
            <!-- body -->
            <div id="edit-primary-content" class="content">
                <div class="height-limiter">
                    <table>
                        <thead>
                            <tr>                      
                                <th width=''>Name</th>
                                <th width=''>Company</th>
                            </tr>
                        </thead>
                        <tbody id="contact-persons-list-table">
                        </tbody>
                    </table>
                </div>
                <div class="page-nav">
                    <div class="page-count">
                        <span class="current-page" id="contact-persons-list-part"></span>
                        <span class="all-page" id="contact-persons-list-total"></span>
                    </div>
                    <div class="page-nav-arrow">
                        <a id="contact-persons-list-prev" class="prev" href="#" title="Previous"><span class="icon"></span></a>
                        <a id="contact-persons-list-next" class="next" href="#" title="Next"><span class="icon"></span></a>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>

<!-- CREATE CONTACT PERSONS -->
<div id="contact-persons-create" style="display:none;" class="contact-info plain-list">
    <form>
        <input type="hidden" id="contact-persons-create-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
        <div class="contact-info-details">
            <div class="section primary-info expanded">
                <div id="expand-primary" class="header"><h3><b>Add Contact Person</b></h3></div>
            </div>
            <div id="edit-primary-content" class="content">
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Name*</span></div>
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
                    <div class="field-secondary"><span class="label">Email*</span></div>
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
                        <textarea rows="4" id="contact-persons-create-address" class="text"></textarea>
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
                                <a id="contact-persons-create-cancel-button" class="cancel" href="#">Cancel</a>
                            </div>
                            <div class="pseudo-field pseudo-button primary-button">
                                <button id="contact-persons-create-save-button">Create</button>
                            </div>
                        </div><!-- End Field Action Content -->
                    </div><!-- End Field Action -->
                </div><!-- End UI Dialog Footer Block -->
            </div>
        </div>
    </form>
</div>

<!-- VIEW CONTACT PERSONS -->
<div id="contact-persons-view" style="display:none;" class="contact-info plain-list">
    <form>
        <input type="hidden" id="contact-persons-view-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
        <div class="contact-info-details">
            <div class="section primary-info expanded">
                <div id="expand-primary" class="header">
                    <h3><b>Contact Person Details</b></h3>&nbsp&nbsp
                    <a id="contact-persons-view-edit-button" href="#">[Edit]</a>
                    <a id="contact-persons-view-delete-button" href="#" style="float:right;">[Delete]</a>
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
                        <div id="contact-persons-view-notes" class="pseudo-field no-border">
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <a id="contact-persons-view-back-button" href="#">[Back]</a>
            </div>
        </div>
    </form>
</div>

<!-- EDIT CONTACT PERSONS -->
<div id="contact-persons-edit" style="display:none;" class="contact-info plain-list">
    <form>
        <input type="hidden" id="contact-persons-edit-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
        <div class="contact-info-details">
            <div class="section primary-info expanded">
                <div id="expand-primary" class="header"><h3><b>Contact Person Details</b></h3></div>
            </div>
            <div id="edit-primary-content" class="content">
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Name*</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field">
                        <input type="text" id="contact-persons-edit-name" class="text"></input>
                        <span id="contact-persons-edit-name-error" class="field-input-name-error error-message" style="display: none;"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Company</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field">
                        <input type="text" id="contact-persons-edit-company" class="text"></input>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Position</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field">
                        <input type="text" id="contact-persons-edit-position" class="text"></input>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Email*</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field">
                        <input type="text" id="contact-persons-edit-email" class="text"></input>
                        <span id="contact-persons-edit-email-error" class="field-input-name-error error-message" style="display: none;"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Contact Numbers</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field">
                        <input type="text" id="contact-persons-edit-contacts" class="text"></input>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Address</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field">
                        <textarea rows="4" id="contact-persons-edit-address" class="text"></textarea>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Notes</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field">
                        <textarea rows="4" id="contact-persons-edit-notes" class="text"></textarea>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="dialog-footer-block">
                    <div class="field field-text">
                        <div class="field-action-content">
                            <div class="pseudo-field pseudo-button">
                                <a id="contact-persons-edit-cancel-button" class="cancel" href="#">Cancel</a>
                            </div>
                            <div class="pseudo-field pseudo-button primary-button">
                                <button id="contact-persons-edit-save-button">Save Changes</button>
                            </div>
                        </div><!-- End Field Action Content -->
                    </div><!-- End Field Action -->
                </div><!-- End UI Dialog Footer Block -->
            </div>
        </div>
    </form>
</div>