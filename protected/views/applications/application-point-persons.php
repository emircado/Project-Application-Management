<!-- LIST APPLICATION POINT PERSONS -->
<div id="app-point-persons-list">
    <form>
        <input type="hidden" id="app-point-persons-list-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
        <div class="contact-info-details">
            <!-- header -->
            <div class="section primary-info expanded">
                <div id="expand-primary" class="header">
                    <h3><b>Point Persons</b></h3>&nbsp&nbsp
                    <a id="app-point-persons-list-create-button" href="#">[Add]</a>
                </div>
            </div>
            <!-- body -->
            <div id="edit-primary-content" class="content">
                <div class="height-limiter">
                    <table>
                        <thead>
                            <tr>                      
                                <th width=''>Name</th>
                                <th width=''>User Group</th>
                            </tr>
                        </thead>
                        <tbody id="app-point-persons-list-table">
                        </tbody>
                    </table>
                </div>
                <div class="page-nav">
                    <div class="page-count">
                        <span class="current-page" id="app-point-persons-list-part"></span>
                        <span class="all-page" id="app-point-persons-list-total"></span>
                    </div>
                    <div class="page-nav-arrow">
                        <a id="app-point-persons-list-prev" class="prev" href="#" title="Previous"><span class="icon"></span></a>
                        <a id="app-point-persons-list-next" class="next" href="#" title="Next"><span class="icon"></span></a>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>

<!-- CREATE APPLICATION POINT PERSONS -->
<div id="app-point-persons-create" style="display:none;" class="contact-info plain-list">
    <form>
        <input type="hidden" id="app-point-persons-create-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
        <div class="contact-info-details">
            <div class="section primary-info expanded">
                <div id="expand-primary" class="header"><h3><b>Add Point Person</b></h3></div>
            </div>
            <div id="edit-primary-content" class="content">
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">User Group*</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field">
                        <select class="select" id="app-point-persons-create-usergroup">
                        </select>
                        <span id="app-point-persons-create-usergroup-error" class="field-input-name-error error-message" style="display: none;"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Name*</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field">
                        <select class="select" id="app-point-persons-create-username">
                        </select>
                        <span id="app-point-persons-create-username-error" class="field-input-name-error error-message" style="display: none;"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Description</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field">
                        <textarea rows="4" id="app-point-persons-create-description" class="text"></textarea>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="dialog-footer-block">
                    <div class="field field-text">
                        <div class="field-action-content">
                            <div class="pseudo-field pseudo-button">
                                <a id="app-point-persons-create-cancel-button" class="cancel" href="#">Cancel</a>
                            </div>
                            <div class="pseudo-field pseudo-button primary-button">
                                <button id="app-point-persons-create-save-button">Create</button>
                            </div>
                        </div><!-- End Field Action Content -->
                    </div><!-- End Field Action -->
                </div><!-- End UI Dialog Footer Block -->
            </div>
        </div>
    </form>
</div>

<!-- VIEW APPLICATION POINT PERSONS -->
<div id="app-point-persons-view" style="display:none;" class="contact-info plain-list">
    <form>
        <input type="hidden" id="app-point-persons-view-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
        <div class="contact-info-details">
            <div class="section primary-info expanded">
                <div id="expand-primary" class="header">
                    <h3><b>Point Person Details</b></h3>&nbsp&nbsp
                    <a id="app-point-persons-edit-button" href="#">[Edit]</a>
                    <a id="app-point-persons-delete-button" href="#" style="float:right;">[Delete]</a>
                </div>
            </div>
            <div id="edit-primary-content" class="content">
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Name</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span class="value" id="app-point-persons-view-username"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">User Group</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span class="value" id="app-point-persons-view-usergroup"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field --> 
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Description</span></div>
                    <div class="field-primary">
                        <div id="app-point-persons-view-description" class="pseudo-field no-border">
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <a id="app-point-persons-back-button" href="#">[Back]</a>
            </div>
        </div>
    </form>
</div>

<!-- EDIT APPLICATION POINT PERSONS -->
<div id="app-point-persons-edit" style="display:none;" class="contact-info plain-list">
    <form>
        <input type="hidden" id="app-point-persons-edit-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
        <div class="contact-info-details">
            <div class="section primary-info expanded">
                <div id="expand-primary" class="header"><h3><b>Point Person Details</b></h3></div>
            </div>
            <div id="edit-primary-content" class="content">
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Name</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span class="value" id="app-point-persons-edit-username"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">User Group</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span class="value" id="app-point-persons-edit-usergroup"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field --> 
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Description</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field">
                        <textarea rows="4" id="app-point-persons-edit-description" class="text"></textarea>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="dialog-footer-block">
                    <div class="field field-text">
                        <div class="field-action-content">
                            <div class="pseudo-field pseudo-button">
                                <a id="app-point-persons-edit-cancel-button" class="cancel" href="#">Cancel</a>
                            </div>
                            <div class="pseudo-field pseudo-button primary-button">
                                <button id="app-point-persons-edit-save-button">Save Changes</button>
                            </div>
                        </div><!-- End Field Action Content -->
                    </div><!-- End Field Action -->
                </div><!-- End UI Dialog Footer Block -->
            </div>
        </div>
    </form>
</div>