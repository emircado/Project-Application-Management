                        <!-- edit part view -->
                        <div id="edit-contact-persons-view" style="display:none;" class="contact-info plain-list">
                            <!-- FORM HERE -->
                            <form>
                                <input type="hidden" id="contact-persons-edit-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
                                <div class="contact-info-details">
                                    <div class="section primary-info expanded">
                                        <div id="expand-primary" class="header"><h3><b>Contact Person Details</b></h3></div>
                                    </div>
                                    <!--CONTENT for EDIT PROJECT-->
                                    <div id="edit-primary-content" class="content">
                                        <div class="field field-input-name">
                                            <div class="field-secondary"><span class="label">Name</span><span>(required)</span></div>
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
                                            <div class="field-secondary"><span class="label">Email</span><span>(required)</span></div>
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
                                                <input type="text" id="contact-persons-edit-address" class="text"></input>
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
                                                        <a id="contact-persons-edit-button-cancel" class="cancel" href="#">Cancel</a>
                                                    </div>
                                                    <div class="pseudo-field pseudo-button primary-button">
                                                        <button id="edit-button-update-contact-persons">Save Changes</button>
                                                    </div>
                                                </div><!-- End Field Action Content -->
                                            </div><!-- End Field Action -->
                                        </div><!-- End UI Dialog Footer Block -->
                                    </div>
                                    <!--END EDIT CONTENT PROJECT-->
                                </div>
                            </form>
                        </div><!--END edit user-->