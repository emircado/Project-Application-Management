<!-- LIST APPLICATION NOTES -->
<div id="application-notes-list">
    <form>
        <input type="hidden" id="application-notes-list-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
        <div class="contact-info-details">
            <!-- header -->
            <div class="section primary-info expanded">
                <div id="expand-primary" class="header">
                    <h3><b>Notes</b></h3>&nbsp&nbsp
                    <a id="application-notes-list-create-button" href="#">[Add]</a>
                </div>
            </div>
            <!-- body -->
            <div id="edit-primary-content" class="content">
                <div class="height-limiter">
                    <table>
                        <thead>
                            <tr>                      
                                <th width='160px'>Date Created</th>
                                <th width=''>Notes</th>
                            </tr>
                        </thead>
                        <tbody id="application-notes-list-table">
                        </tbody>
                    </table>
                </div>
                <div class="page-nav">
                    <div class="page-count">
                        <span class="current-page" id="application-notes-list-part"></span>
                        <span class="all-page" id="application-notes-list-total"></span>
                    </div>
                    <div class="page-nav-arrow">
                        <a id="application-notes-list-prev" class="prev" href="#" title="Previous"><span class="icon"></span></a>
                        <a id="application-notes-list-next" class="next" href="#" title="Next"><span class="icon"></span></a>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>